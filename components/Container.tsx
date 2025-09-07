import { SafeAreaView, View } from 'react-native';

export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView className={styles.container}>
      <View className={styles.content}>{children}</View>
    </SafeAreaView>
  );
};

const styles = {
  container: 'flex flex-1 bg-white',
  content: 'flex flex-1 px-6 pt-4',
};
