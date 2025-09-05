import { Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect, useRef } from 'react';

type ScreenContentProps = {
  title: string;
  children?: React.ReactNode;
};

export const ScreenContent = ({ title, children }: ScreenContentProps) => {
  const [studyTopic, setStudyTopic] = useState('');
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (studyTopic.trim() === '') {
      Alert.alert('Atenção', 'Por favor, informe o que você vai estudar.');
      return;
    }
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const stopTimer = () => {
    Alert.alert('Confirmar', 'Tem certeza que deseja encerrar o cronômetro?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Encerrar',
        style: 'destructive',
        onPress: () => {
          setIsRunning(false);
          setIsPaused(false);
          setTime(0);
          setStudyTopic('');
        },
      },
    ]);
  };

  return (
    <View className={styles.container}>
      <Text className={styles.title}>{title}</Text>
      <View className={styles.separator} />

      <View className={styles.studyContainer}>
        <Text className={styles.label}>O que você vai estudar?</Text>
        <TextInput
          className={styles.input}
          value={studyTopic}
          onChangeText={setStudyTopic}
          placeholder="Digite o assunto de estudo..."
          editable={!isRunning}
        />

        <View className={styles.timerContainer}>
          <Text className={styles.timer}>{formatTime(time)}</Text>
        </View>

        <View className={styles.buttonContainer}>
          {!isRunning ? (
            <TouchableOpacity className={styles.startButton} onPress={startTimer}>
              <Text className={styles.buttonText}>Iniciar</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                className={isPaused ? styles.resumeButton : styles.pauseButton}
                onPress={pauseTimer}>
                <Text className={styles.buttonText}>{isPaused ? 'Retomar' : 'Pausar'}</Text>
              </TouchableOpacity>
              <TouchableOpacity className={styles.stopButton} onPress={stopTimer}>
                <Text className={styles.buttonText}>Encerrar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {children}
    </View>
  );
};
const styles = {
  container: `items-center flex-1 justify-center px-4`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold`,
  studyContainer: `w-full max-w-sm mb-8`,
  label: `text-lg font-semibold mb-2 text-center`,
  input: `border border-gray-300 rounded-lg px-4 py-3 text-base mb-4 bg-white`,
  timerContainer: `bg-gray-100 rounded-lg p-6 mb-4`,
  timer: `text-4xl font-mono font-bold text-center text-blue-600`,
  buttonContainer: `flex-row justify-center gap-3`,
  startButton: `bg-green-500 px-6 py-3 rounded-lg`,
  pauseButton: `bg-yellow-500 px-6 py-3 rounded-lg`,
  resumeButton: `bg-blue-500 px-6 py-3 rounded-lg`,
  stopButton: `bg-red-500 px-6 py-3 rounded-lg`,
  buttonText: `text-white font-semibold text-base`,
};
