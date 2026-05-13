import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { initDb } from '../lib/database';

export default function RootLayout() {
  useEffect(() => {
    initDb();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="task-detail" options={{ title: 'Task Details' }} />
    </Stack>
  );
}
