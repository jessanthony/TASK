import { getTaskById, Task, TASK_STATUSES, TaskStatus, updateTask } from "@/lib/database";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  useWindowDimensions,
  View,
} from "react-native";

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState<TaskStatus>("Pending");
  const [toastMessage, setToastMessage] = useState("");
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 600;

  const showFeedback = useCallback((message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
      return;
    }

    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 1800);
  }, []);

  const loadTask = useCallback(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      const data = getTaskById(Number(id));
      setTask(data);
    } catch {
      Alert.alert("Error", "Failed to load task details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadTask();
    }, [loadTask])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        loadTask();
      }
    });

    return () => subscription.remove();
  }, [loadTask]);

  const openEditModal = () => {
    if (!task) {
      return;
    }

    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditStatus(task.status);
    setEditVisible(true);
  };

  const handleSaveUpdate = () => {
    if (!task) {
      return;
    }

    if (!editTitle.trim() || !editDescription.trim()) {
      Alert.alert("Validation Error", "Title and Description are required");
      return;
    }

    try {
      setSaving(true);
      updateTask(task.id, editTitle, editDescription, editStatus);
      const updatedTask = getTaskById(task.id);

      setTask(updatedTask);
      setEditVisible(false);
      showFeedback("Task updated");
    } catch {
      Alert.alert("Update Error", "Failed to update task");
    } finally {
      setSaving(false);
    }
  };

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
      {toastMessage ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      ) : null}

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
          <View style={styles.statusActions}>
            <View
              style={[
                styles.statusBadge,
                isLargeScreen && styles.statusBadgeLarge,
                task.status === "Completed"
                  ? styles.statusCompleted
                  : task.status === "In Progress"
                    ? styles.statusInProgress
                    : styles.statusPending,
              ]}
            >
              <Text style={styles.statusText}>{task.status}</Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.updateButton,
                pressed && styles.updateButtonPressed,
              ]}
              onPress={openEditModal}
            >
              <Text style={styles.updateButtonText}>Update</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={editVisible}
        onRequestClose={() => setEditVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Update Task</Text>

            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.input}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Task title"
              placeholderTextColor="#aac4f0"
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={editDescription}
              onChangeText={setEditDescription}
              placeholder="Task description"
              placeholderTextColor="#aac4f0"
              multiline
            />

            <Text style={styles.inputLabel}>Status</Text>
            <View style={styles.statusPicker}>
              {TASK_STATUSES.map((status) => (
                <Pressable
                  key={status}
                  style={[
                    styles.statusOption,
                    editStatus === status && styles.statusOptionActive,
                  ]}
                  onPress={() => setEditStatus(status)}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      editStatus === status && styles.statusOptionTextActive,
                    ]}
                  >
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                disabled={saving}
                onPress={() => setEditVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modalButton,
                  styles.saveButton,
                  saving && styles.buttonDisabled,
                ]}
                disabled={saving}
                onPress={handleSaveUpdate}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  statusActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  statusBadgeLarge: {
    alignSelf: "auto",
    marginTop: 0,
  },
  statusCompleted: {
    backgroundColor: "#48bb78",
  },
  statusInProgress: {
    backgroundColor: "#3b72f6",
  },
  statusPending: {
    backgroundColor: "#ed8936",
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  updateButton: {
    minHeight: 34,
    borderWidth: 1,
    borderColor: "#aac4f0",
    borderRadius: 8,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  updateButtonPressed: {
    backgroundColor: "#eef4ff",
  },
  updateButtonText: {
    color: "#3b72f6",
    fontSize: 13,
    fontWeight: "700",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    color: "#1a1a2e",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 16,
  },
  inputLabel: {
    color: "#1a3a6e",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.4,
    marginBottom: 7,
    marginTop: 12,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#aac4f0",
    borderRadius: 10,
    color: "#1a1a2e",
    fontSize: 15,
    padding: 12,
    backgroundColor: "#fff",
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  statusPicker: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusOption: {
    flex: 1,
    minWidth: 100,
    minHeight: 42,
    borderWidth: 1.5,
    borderColor: "#aac4f0",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  statusOptionActive: {
    backgroundColor: "#3b72f6",
    borderColor: "#3b72f6",
  },
  statusOptionText: {
    color: "#3b72f6",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  statusOptionTextActive: {
    color: "#fff",
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 22,
  },
  modalButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    borderWidth: 1.5,
    borderColor: "#aac4f0",
    backgroundColor: "#fff",
  },
  cancelButtonText: {
    color: "#3b72f6",
    fontSize: 15,
    fontWeight: "800",
  },
  saveButton: {
    backgroundColor: "#3b72f6",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
  buttonDisabled: {
    opacity: 0.75,
  },
  toast: {
    position: "absolute",
    top: 14,
    left: 20,
    right: 20,
    zIndex: 10,
    maxWidth: 520,
    alignSelf: "center",
    backgroundColor: "#1a1a2e",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  toastText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
});
