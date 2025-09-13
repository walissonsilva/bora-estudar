import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

type InitialScreenProps = {
  studyTopic: string;
  onStudyTopicChange: (text: string) => void;
  onStart: () => void;
};

export const InitialScreen = ({ studyTopic, onStudyTopicChange, onStart }: InitialScreenProps) => {
  return (
    <View className={styles.container}>
      <View className={styles.iconContainer}>
        <FontAwesome5 name="book-reader" size={60} color="#264389" />
      </View>
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
      </View>
      <TouchableOpacity
        className={styles.startButton}
        onPress={onStart}
        disabled={!studyTopic.trim()}>
        <Text className={styles.startButtonText}>Iniciar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: `w-full items-center justify-center`,
  iconContainer: `bg-gray-50 p-6 rounded-full mb-6 shadow-sm`,
  questionText: `text-2xl font-bold text-center mb-6 text-[#1D2B4F]`,
  inputRow: `flex-row items-center w-full max-w-md mb-6`,
  input: `flex-1 border border-gray-300 rounded-lg px-4 py-3 text-base bg-white`,
  startButton: `bg-[#F1827F] px-8 py-3 rounded-lg items-center justify-center w-40`,
  startButtonText: `text-white font-bold text-lg`,
};
