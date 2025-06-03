import { apiClient } from '@/app/_lib/api/client';
import type { Todo } from '@/app/_lib/api/types';
import { useCallback, useEffect, useState } from 'react';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<Todo[]>('/api/todos');
      setTodos(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTodo = async (
    todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const newTodo = await apiClient.post<Todo>('/api/todos', todo);
      setTodos((prev) => [...prev, newTodo]);
      return newTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add todo');
      throw err;
    }
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const updatedTodo = await apiClient.patch<Todo>(
        `/api/todos/${id}`,
        updates
      );
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
      return updatedTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
      throw err;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await apiClient.delete(`/api/todos/${id}`);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
      throw err;
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    refetch: fetchTodos,
  };
}
