import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';

type InitialScreenProps = {
  studyTopic: string;
  onStudyTopicChange: (text: string) => void;
  onStart: () => void;
};

export const InitialScreen = ({ studyTopic, onStudyTopicChange, onStart }: InitialScreenProps) => {
  return (
    <>
      <Text className={styles.questionText}>O que vamos estudar hoje?</Text>
      <View className={styles.inputContainer}>
        <TextInput
          className={styles.input}
          value={studyTopic}
          onChangeText={onStudyTopicChange}
          placeholder="Digite o assunto..."
          onSubmitEditing={onStart}
          returnKeyType="go"
        />
        <TouchableOpacity
          className={styles.startButton}
          onPress={onStart}
          disabled={!studyTopic.trim()}>
          <Text className={styles.startButtonText}>Iniciar</Text>
          <Entypo name="controller-play" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = {
  questionText: `text-3xl font-bold text-center mb-8 text-gray-800`,
  inputContainer: `items-center gap-4 w-full max-w-md`,
  input: `w-full border border-gray-300 rounded-lg px-4 py-3 text-base bg-white`,
  startButton: `bg-green-500 px-6 py-3 rounded-lg items-center justify-center flex-row gap-2 mt-4`,
  startButtonText: `text-white font-semibold text-lg`,
};
