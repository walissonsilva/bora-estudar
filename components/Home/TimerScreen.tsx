import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';

type TimerScreenProps = {
  studyTopic: string;
  minutes: number;
  seconds: number;
  onReset: () => void;
  onStop: () => void;
};

export const TimerScreen = ({
  studyTopic,
  minutes,
  seconds,
  onReset,
  onStop,
}: TimerScreenProps) => {
  return (
    <>
      <Text className={styles.studyTopicDisplay}>{studyTopic}</Text>
      <Text className={styles.title}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </Text>
      <View className={styles.separator} />
      <View className={styles.buttonContainer}>
        <TouchableOpacity className={styles.button} onPress={onReset}>
          <AntDesign name="reload1" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className={styles.button} onPress={onStop}>
          <Entypo name="controller-stop" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = {
  studyTopicDisplay: `text-2xl font-semibold text-center mb-8 text-blue-600`,
  title: `text-8xl font-mono font-bold text-center text-gray-800`,
  separator: `my-8 h-px bg-gray-200 w-full max-w-xs`,
  buttonContainer: `flex-row gap-4`,
  button: `bg-blue-500 w-16 h-16 rounded-full items-center justify-center`,
};
