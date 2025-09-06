import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { InitialScreen } from './InitialScreen';
import { TimerScreen } from './TimerScreen';

export const Home = () => {
  const [showTimer, setShowTimer] = useState(false);
  const [studyTopic, setStudyTopic] = useState('');
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

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
    } else if (minutes === 0 && seconds === 0) {
      setIsRunning(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, minutes, seconds]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setMinutes(25);
    setSeconds(0);
    setIsRunning(false);
  };

  const startStudySession = () => {
    if (studyTopic.trim()) {
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
        onPress: () => {
          setShowTimer(false);
          setIsRunning(false);
          setMinutes(25);
          setSeconds(0);
          setStudyTopic('');
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
