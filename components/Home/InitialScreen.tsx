import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

type InitialScreenProps = {
  studyTopic: string;
  onStudyTopicChange: (text: string) => void;
  onStart: () => void;
};

export const InitialScreen = ({ studyTopic, onStudyTopicChange, onStart }: InitialScreenProps) => {
  return (
    <>
      <Text className={styles.questionText}>O que vamos estudar hoje?</Text>
      <View className={styles.inputRow}>
        <TextInput
          className={styles.input}
          value={studyTopic}
          onChangeText={onStudyTopicChange}
          placeholder="Digite o assunto..."
          onSubmitEditing={onStart}
          returnKeyType="go"
        />
        <TouchableOpacity
          className={styles.playButton}
          onPress={onStart}
          disabled={!studyTopic.trim()}
        >
          <AntDesign name="rightcircle" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = {
  questionText: `text-3xl font-bold text-center mb-8 text-gray-800`,
  inputRow: `flex-row items-center gap-4 w-full max-w-md`,
  input: `flex-1 border border-gray-300 rounded-lg px-4 py-3 text-base bg-white`,
  playButton: `bg-green-500 w-12 h-12 rounded-full items-center justify-center`,
};