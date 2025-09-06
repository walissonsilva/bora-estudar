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
  const [isRunning, setIsRunning] = useState(false);
  const appState = useRef(AppState.currentState);
  const startTimeRef = useRef<number | null>(null);
  const totalDurationRef = useRef<number>(0);

  // Salvar estado do timer
  const saveTimerState = async () => {
    try {
      const timerState = {
        showTimer,
        studyTopic,
        minutes,
        seconds,
        isRunning,
        startTime: startTimeRef.current,
        totalDuration: totalDurationRef.current,
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
        setMinutes(timerState.minutes);
        setSeconds(timerState.seconds);
        setIsRunning(timerState.isRunning);
        startTimeRef.current = timerState.startTime;
        totalDurationRef.current = timerState.totalDuration;
      }
    } catch (error) {
      console.error('Erro ao carregar estado do timer:', error);
    }
  };

  // Calcular tempo restante baseado no timestamp
  const calculateRemainingTime = () => {
    if (!startTimeRef.current) return;

    const now = Date.now();
    const elapsed = Math.floor((now - startTimeRef.current) / 1000);
    const remaining = Math.max(0, totalDurationRef.current - elapsed);

    const newMinutes = Math.floor(remaining / 60);
    const newSeconds = remaining % 60;

    setMinutes(newMinutes);
    setSeconds(newSeconds);

    if (remaining === 0) {
      setIsRunning(false);
      Alert.alert('Tempo Esgotado!', 'Seu tempo de estudo terminou!');
    }
  };

  // AppState listener
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App voltou ao foreground
        loadTimerState().then(() => {
          // Aguardar um pouco para garantir que o estado foi atualizado
          setTimeout(() => {
            if (isRunning) calculateRemainingTime();
          }, 100);
        });
      } else if (nextAppState.match(/inactive|background/)) {
        // App foi para background
        // saveTimerState();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Carregar estado inicial
    loadTimerState();

    return () => {
      subscription?.remove();
    };
  }, []);

  // Timer principal
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }, 1000);
    } else if (minutes === 0 && seconds === 0 && isRunning) {
      setIsRunning(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, minutes, seconds]);

  // Salvar estado sempre que houver mudanças
  useEffect(() => {
    if (showTimer) {
      saveTimerState();
    }
  }, [showTimer, studyTopic, minutes, seconds, isRunning]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setMinutes(25);
    setSeconds(0);
    setIsRunning(false);
    startTimeRef.current = null;
    totalDurationRef.current = 0;
    saveTimerState();
  };

  const startStudySession = () => {
    if (studyTopic.trim()) {
      const now = Date.now();
      const totalSeconds = minutes * 60 + seconds;

      startTimeRef.current = now;
      totalDurationRef.current = totalSeconds;

      setShowTimer(true);
      setIsRunning(true);
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
          setIsRunning(false);
          setMinutes(25);
          setSeconds(0);
          setStudyTopic('');
          startTimeRef.current = null;
          totalDurationRef.current = 0;

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
          isRunning={isRunning}
          onToggleTimer={toggleTimer}
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
