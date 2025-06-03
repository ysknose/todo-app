import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '../_lib/api/client';
import type {
  ApiError,
  CreateTaskRequest,
  Task,
  UpdateTaskRequest,
} from '../_lib/api/types';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (task: CreateTaskRequest) => Promise<void>;
  updateTask: (id: string, updates: UpdateTaskRequest) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
  getTasksByStatus: (status: Task['status']) => Task[];
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await apiClient.getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      const errorMessage =
        err && typeof err === 'object' && 'message' in err
          ? (err as ApiError).message
          : 'タスクの取得に失敗しました';
      setError(errorMessage);
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData: CreateTaskRequest) => {
    try {
      setError(null);
      const newTask = await apiClient.createTask(taskData);
      setTasks((prev) => [...prev, newTask]);
    } catch (err) {
      const errorMessage =
        err && typeof err === 'object' && 'message' in err
          ? (err as ApiError).message
          : 'タスクの作成に失敗しました';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateTask = useCallback(
    async (id: string, updates: UpdateTaskRequest) => {
      try {
        setError(null);
        const updatedTask = await apiClient.updateTask(id, updates);
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updatedTask : task))
        );
      } catch (err) {
        const errorMessage =
          err && typeof err === 'object' && 'message' in err
            ? (err as ApiError).message
            : 'タスクの更新に失敗しました';
        setError(errorMessage);
        throw err;
      }
    },
    []
  );

  const deleteTask = useCallback(async (id: string) => {
    try {
      setError(null);
      await apiClient.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      const errorMessage =
        err && typeof err === 'object' && 'message' in err
          ? (err as ApiError).message
          : 'タスクの削除に失敗しました';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const getTasksByStatus = useCallback(
    (status: Task['status']) => {
      return tasks.filter((task) => task.status === status);
    },
    [tasks]
  );

  const refreshTasks = useCallback(async () => {
    await fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks,
    getTasksByStatus,
  };
}
