import React, { useState, useEffect, useRef } from 'react';
import { View, Alert, AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InitialScreen } from './InitialScreen';
import { TimerScreen } from './TimerScreen';

const TIMER_STORAGE_KEY = 'timer_state';

export const Home = () => {
  const [showTimer, setShowTimer] = useState(false);
  const [studyTopic, setStudyTopic] = useState('');
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);

  const appState = useRef(AppState.currentState);
  const endTimeRef = useRef<number | null>(null);

  // Salvar estado do timer
  const saveTimerState = async () => {
    try {
      const timerState = {
        showTimer,
        studyTopic,
        endTime: endTimeRef.current,
      };
      await AsyncStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(timerState));
      console.log(timerState);
    } catch (error) {
      console.error('Erro ao salvar estado do timer:', error);
    }
  };

  // Recuperar estado do timer
  const loadTimerState = async () => {
    try {
      const savedState = await AsyncStorage.getItem(TIMER_STORAGE_KEY);
      console.log(savedState);
      if (savedState) {
        const timerState = JSON.parse(savedState);
        setShowTimer(timerState.showTimer);
        setStudyTopic(timerState.studyTopic);
        endTimeRef.current = timerState.endTime;
        
        // Se há um timer ativo, calcular tempo restante
        if (timerState.showTimer && timerState.endTime) {
          calculateRemainingTime();
        }
      }
    } catch (error) {
      console.error('Erro ao carregar estado do timer:', error);
    }
  };

  // Calcular tempo restante baseado no timestamp final
  const calculateRemainingTime = () => {
    if (!endTimeRef.current) return;

    const now = Date.now();
    const remaining = Math.max(0, Math.floor((endTimeRef.current - now) / 1000));

    const newMinutes = Math.floor(remaining / 60);
    const newSeconds = remaining % 60;

    setMinutes(newMinutes);
    setSeconds(newSeconds);

    if (remaining === 0) {
      Alert.alert('Tempo Esgotado!', 'Seu tempo de estudo terminou!', [
        {
          text: 'OK',
          onPress: async () => {
            setShowTimer(false);
            setStudyTopic('');
            setMinutes(25);
            setSeconds(0);
            endTimeRef.current = null;
            await AsyncStorage.removeItem(TIMER_STORAGE_KEY);
          }
        }
      ]);
      return false;
    }
    return true;
  };

  // AppState listener
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App voltou ao foreground - recalcular tempo restante
        if (showTimer && endTimeRef.current) {
          const isActive = calculateRemainingTime();
          if (!isActive) {
            // Timer já terminou enquanto estava em background
            return;
          }
        }
      } else if (nextAppState.match(/inactive|background/)) {
        // App foi para background - salvar estado
        if (showTimer) {
          saveTimerState();
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Carregar estado inicial
    loadTimerState();

    return () => {
      subscription?.remove();
    };
  }, [showTimer]);

  // Timer principal baseado em timestamps
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (showTimer && endTimeRef.current) {
      interval = setInterval(() => {
        const isActive = calculateRemainingTime();
        if (!isActive) {
          // Timer terminou, limpar interval
          if (interval) clearInterval(interval);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showTimer]);

  // Salvar estado quando timer é iniciado ou tópico muda
  useEffect(() => {
    if (showTimer && endTimeRef.current) {
      saveTimerState();
    }
  }, [showTimer, studyTopic]);

  const resetTimer = () => {
    const now = Date.now();
    const totalSeconds = 25 * 60; // 25 minutos em segundos
    endTimeRef.current = now + (totalSeconds * 1000);
    setMinutes(25);
    setSeconds(0);
    saveTimerState();
  };

  const startStudySession = () => {
    if (studyTopic.trim()) {
      const now = Date.now();
      const totalSeconds = minutes * 60 + seconds;
      endTimeRef.current = now + (totalSeconds * 1000);

      setShowTimer(true);
      saveTimerState();
    }
  };

  const stopTimer = () => {
    Alert.alert('Confirmar', 'Tem certeza que deseja parar o timer?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Parar',
        style: 'destructive',
        onPress: async () => {
          setShowTimer(false);
          setMinutes(25);
          setSeconds(0);
          setStudyTopic('');
          endTimeRef.current = null;

          // Limpar estado salvo
          try {
            await AsyncStorage.removeItem(TIMER_STORAGE_KEY);
          } catch (error) {
            console.error('Erro ao limpar estado do timer:', error);
          }
        },
      },
    ]);
  };

  return (
    <View className={styles.container}>
      {!showTimer ? (
        <InitialScreen
          studyTopic={studyTopic}
          onStudyTopicChange={setStudyTopic}
          onStart={startStudySession}
        />
      ) : (
        <TimerScreen
          studyTopic={studyTopic}
          minutes={minutes}
          seconds={seconds}
          onReset={resetTimer}
          onStop={stopTimer}
        />
      )}
    </View>
  );
};
const styles = {
  container: `flex-1 bg-gray-50 items-center justify-center px-6`,
};
