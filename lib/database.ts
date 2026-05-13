import * as SQLite from 'expo-sqlite';

export const TASK_STATUSES = ['Pending', 'In Progress', 'Completed'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
};

let db: SQLite.SQLiteDatabase | null = null;
let initialized = false;

const getDb = () => {
  if (!db) {
    db = SQLite.openDatabaseSync('tasks.db');
  }

  return db;
};

export const initDb = () => {
  if (initialized) {
    return;
  }

  const database = getDb();
  database.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pending'
    );
  `);
  initialized = true;
};

export const addTask = (title: string, description: string, status: TaskStatus) => {
  initDb();
  const database = getDb();
  const result = database.runSync(
    'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)',
    [title.trim(), description.trim(), status]
  );

  return result.lastInsertRowId;
};

export const getTask = (): Task[] => {
  initDb();
  const database = getDb();
  return database.getAllSync<Task>('SELECT * FROM tasks ORDER BY id DESC');
};

export const getTaskById = (id: number): Task | null => {
  initDb();
  const database = getDb();
  return database.getFirstSync<Task>('SELECT * FROM tasks WHERE id = ?', [id]);
};

export const deleteTask = (id: number) => {
  initDb();
  const database = getDb();
  database.runSync('DELETE FROM tasks WHERE id = ?', [id]);
};

export const updateTask = (
  id: number,
  title: string,
  description: string,
  status: TaskStatus
) => {
  initDb();
  const database = getDb();
  database.runSync(
    'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?',
    [title.trim(), description.trim(), status, id]
  );
};

export const updateTaskStatus = (id: number, status: TaskStatus) => {
  initDb();
  const database = getDb();
  database.runSync('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
};

export const getNextTaskStatus = (status: TaskStatus): TaskStatus => {
  const currentIndex = TASK_STATUSES.indexOf(status);
  const nextIndex = currentIndex === TASK_STATUSES.length - 1 ? 0 : currentIndex + 1;

  return TASK_STATUSES[nextIndex];
};
