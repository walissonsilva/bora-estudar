import { Entypo } from '@expo/vector-icons';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

type InitialScreenProps = {
  studyTopic: string;
  onStudyTopicChange: (text: string) => void;
  onStart: () => void;
};

export const InitialScreen = ({ studyTopic, onStudyTopicChange, onStart }: InitialScreenProps) => {
  return (
    <View className={styles.container}>
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
          disabled={!studyTopic.trim()}>
          <Entypo name="controller-play" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  container: `w-full items-center justify-center`,
  questionText: `text-3xl font-bold text-center mb-8 text-[#1D2B4F]`,
  inputRow: `flex-row items-center gap-4 w-full max-w-md`,
  input: `flex-1 border border-gray-300 rounded-lg px-4 py-3 text-base bg-white`,
  playButton: `bg-[#F1827F] w-12 h-12 rounded-full items-center justify-center`,
};
