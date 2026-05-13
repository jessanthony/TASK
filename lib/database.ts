import * as SQLite from 'expo-sqlite';

export type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
};

export const initDb = () => {
  try {
    const db = SQLite.openDatabaseSync('tasks.db');
    db.execSync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL
      );
    `);
  } catch (error) {
    console.error('Error initializing db', error);
  }
};

export const addTask = (title: string, description: string, status: string) => {
  try {
    const db = SQLite.openDatabaseSync('tasks.db');
    const result = db.runSync('INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)', [title, description, status]);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding task', error);
  }
};

export const getTask = (): Task[] => {
  try {
    const db = SQLite.openDatabaseSync('tasks.db');
    return db.getAllSync<Task>('SELECT * FROM tasks ORDER BY id DESC');
  } catch (error) {
    console.error('Error getting tasks', error);
    return [];
  }
};

export const getTaskById = (id: number): Task | null => {
  try {
    const db = SQLite.openDatabaseSync('tasks.db');
    return db.getFirstSync<Task>('SELECT * FROM tasks WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error getting task by id', error);
    return null;
  }
};

export const deleteTask = (id: number) => {
  try {
    const db = SQLite.openDatabaseSync('tasks.db');
    db.runSync('DELETE FROM tasks WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error deleting task', error);
  }
};

export const updateTask = (id: number, title: string, description: string, status: string) => {
  try {
    const db = SQLite.openDatabaseSync('tasks.db');
    db.runSync('UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?', [title, description, status, id]);
  } catch (error) {
    console.error('Error updating task', error);
  }
};
