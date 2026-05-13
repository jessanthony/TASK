import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isCompact = width < 380 || height < 720;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={[styles.content, isCompact && styles.contentCompact]}>
        <Text style={[styles.title, isCompact && styles.titleCompact]}>
          Mini Task Application
        </Text>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => router.push('/tasks')}
        >
          <Text style={styles.buttonText}>Open Task</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: '42%',
  },
  contentCompact: {
    paddingHorizontal: 20,
    paddingTop: '34%',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1a1a2e',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 36,
  },
  titleCompact: {
    fontSize: 24,
    lineHeight: 30,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#3b72f6',
    width: '100%',
    maxWidth: 280,
    minHeight: 56,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#3b72f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  buttonPressed: {
    backgroundColor: '#2a5de0',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
