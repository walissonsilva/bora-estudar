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
    <View className={styles.container}>
      <Text className={styles.studyTopicDisplay}>{studyTopic}</Text>
      <Text className={styles.title}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </Text>
      <View className={styles.separator} />
      <View className={styles.buttonContainer}>
        <TouchableOpacity className={styles.resetButton} onPress={onReset}>
          <AntDesign name="reload" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className={styles.stopButton} onPress={onStop}>
          <Entypo name="controller-stop" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  container: `w-full items-center justify-center`,
  studyTopicDisplay: `text-2xl font-semibold text-center mb-8 text-[#264389]`,
  title: `text-8xl font-mono font-bold text-center text-[#1D2B4F]`,
  separator: `my-8 h-px bg-gray-200 w-full max-w-xs`,
  buttonContainer: `flex-row gap-4`,
  resetButton: `bg-[#264389] w-16 h-16 rounded-full items-center justify-center`,
  stopButton: `bg-[#F1827F] w-16 h-16 rounded-full items-center justify-center`,
};
