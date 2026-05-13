import { getTaskById, Task } from "@/lib/database";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 600;

  useEffect(() => {
    if (id) {
      try {
        const data = getTaskById(Number(id));
        setTask(data);
      } catch {
        Alert.alert("Error", "Failed to load task details");
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Task not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.card, isLargeScreen && styles.cardLarge]}>
        <View style={[styles.row, isLargeScreen && styles.rowLarge]}>
          <Text style={[styles.label, isLargeScreen && styles.labelLarge]}>
            Task ID:
          </Text>
          <Text style={styles.value}>{task.id}</Text>
        </View>

        <View style={[styles.row, isLargeScreen && styles.rowLarge]}>
          <Text style={[styles.label, isLargeScreen && styles.labelLarge]}>
            Title:
          </Text>
          <Text style={styles.value}>{task.title}</Text>
        </View>

        <View style={[styles.row, isLargeScreen && styles.rowLarge]}>
          <Text style={[styles.label, isLargeScreen && styles.labelLarge]}>
            Description:
          </Text>
          <Text style={styles.value}>{task.description}</Text>
        </View>

        <View style={[styles.row, isLargeScreen && styles.rowLarge]}>
          <Text style={[styles.label, isLargeScreen && styles.labelLarge]}>
            Status:
          </Text>
          <View
            style={[
              styles.statusBadge,
              isLargeScreen && styles.statusBadgeLarge,
              task.status === "Completed"
                ? styles.statusCompleted
                : styles.statusPending,
            ]}
          >
            <Text style={styles.statusText}>{task.status}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 32,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardLarge: {
    marginTop: 12,
  },
  row: {
    flexDirection: "column",
    marginBottom: 20,
  },
  rowLarge: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    fontWeight: "bold",
  },
  labelLarge: {
    marginBottom: 0,
  },
  value: {
    fontSize: 18,
    color: "#333",
    flexShrink: 1,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 5,
  },
  statusBadgeLarge: {
    alignSelf: "auto",
    marginTop: 0,
  },
  statusCompleted: {
    backgroundColor: "#48bb78", // green
  },
  statusPending: {
    backgroundColor: "#ed8936", // orange
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});
