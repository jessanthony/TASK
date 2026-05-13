import { deleteTask, getTask, Task } from '@/lib/database';
import { useRouter, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TaskScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isLargeScreen = width > 700;

  const loadTask = () => {
    try {
      const data = getTask();
      setTasks(data);
    } catch {
      Alert.alert("Load Error", "Failed to Load the Tasks");
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTask();
    }, [])
  );

  const handleDelete = (id: number) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          try {
            deleteTask(id);
            loadTask();
          } catch {
            Alert.alert("Delete Error", "Failed to Delete Task");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="clipboard-outline" size={64} color="#aac4f0" />
          <Text style={styles.emptyText}>No Tasks Yet</Text>
          <Text style={styles.emptySubtext}>Go to the Add tab to create a task</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          renderItem={({ item }) => (
            <View style={[styles.taskCard, isLargeScreen && styles.taskCardLarge]}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <View style={styles.actionButtons}>
                <Pressable
                  style={styles.viewButton}
                  onPress={() => router.push({ pathname: "/task-detail", params: { id: item.id } })}
                >
                  <Ionicons name="eye-outline" size={14} color="#fff" style={{ marginRight: 5 }} />
                  <Text style={styles.viewButtonText}>View Details</Text>
                </Pressable>
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id)}
                >
                  <Ionicons name="trash-outline" size={16} color="#fff" />
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  listContent: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#3b72f6',
    marginTop: 14,
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#aac4f0',
    marginTop: 6,
    fontSize: 13,
  },
  taskCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#3b72f6',
    shadowColor: '#3b72f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  taskCardLarge: {
    padding: 20,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 12,
    flexShrink: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewButton: {
    backgroundColor: '#3b72f6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#e53e3e',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
