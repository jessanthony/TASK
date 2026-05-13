import { addTask, TaskStatus } from '@/lib/database';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddTaskScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('Pending');
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSave = () => {
    if (!title || !description) {
      Alert.alert('Validation Error', 'Title and Description are required!');
      return;
    }

    try {
      addTask(title, description, status);
      Alert.alert('Success', 'Task added successfully!', [
        {
          text: 'OK',
          onPress: () => {
            setTitle('');
            setDescription('');
            setStatus('Pending');
            router.push('/tasks');
          },
        },
      ]);
    } catch {
      Alert.alert('Save Error', 'Failed to add the task');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + 32 },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.label}>Task Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter task title"
        placeholderTextColor="#aac4f0"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Task Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter task description"
        placeholderTextColor="#aac4f0"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Status</Text>
      <View style={styles.statusContainer}>
        {(['Pending', 'In Progress', 'Completed'] as const).map((s) => (
          <Pressable
            key={s}
            style={[styles.statusButton, status === s && styles.statusButtonActive]}
            onPress={() => setStatus(s)}
          >
            <Text style={[styles.statusText, status === s && styles.statusTextActive]}>{s}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Save Task</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  content: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 18,
    color: '#1a3a6e',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#aac4f0',
    padding: 12,
    borderRadius: 10,
    fontSize: 15,
    backgroundColor: '#fff',
    color: '#1a1a2e',
  },
  textArea: {
    height: 110,
    textAlignVertical: 'top',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 32,
    gap: 8,
  },
  statusButton: {
    flex: 1,
    minWidth: 100,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#aac4f0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  statusButtonActive: {
    backgroundColor: '#3b72f6',
    borderColor: '#3b72f6',
  },
  statusText: {
    color: '#3b72f6',
    fontSize: 11,
    fontWeight: '600',
  },
  statusTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: '#3b72f6',
    minHeight: 54,
    paddingVertical: 15,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    elevation: 4,
    shadowColor: '#3b72f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  saveButtonPressed: {
    backgroundColor: '#2a5de0',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
