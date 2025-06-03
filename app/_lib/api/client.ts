import { API_CONFIG } from './config';
import type {
  ApiError,
  CreateTaskRequest,
  Task,
  UpdateTaskRequest,
  User,
} from './types';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.text();
        const apiError: ApiError = {
          message: `HTTP ${response.status}: ${errorData}`,
          status: response.status,
        };
        throw apiError;
      }

      return await response.json();
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error) {
        throw error;
      }
      const apiError: ApiError = {
        message: `Network error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        status: 0,
      };
      throw apiError;
    }
  }

  // 汎用的なHTTPメソッド
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = void>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // タスク関連のAPI
  async getTasks(): Promise<Task[]> {
    return this.request<Task[]>('/api/tasks');
  }

  async getTask(id: string): Promise<Task> {
    return this.request<Task>(`/api/tasks/${id}`);
  }

  async createTask(task: CreateTaskRequest): Promise<Task> {
    return this.request<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: string, updates: UpdateTaskRequest): Promise<Task> {
    return this.request<Task>(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(id: string): Promise<void> {
    await this.request(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // ステータス別タスク取得
  async getTasksByStatus(status: Task['status']): Promise<Task[]> {
    return this.request<Task[]>(`/api/tasks?status=${status}`);
  }

  // 優先度別タスク取得
  async getTasksByPriority(priority: Task['priority']): Promise<Task[]> {
    return this.request<Task[]>(`/api/tasks?priority=${priority}`);
  }

  // ユーザー関連のAPI
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/api/users');
  }

  async getUser(id: string): Promise<User> {
    return this.request<User>(`/api/users/${id}`);
  }
}

// シングルトンインスタンス
export const apiClient = new ApiClient();

// 個別のAPI関数をエクスポート（後方互換性のため）
export const getTasks = () => apiClient.getTasks();
export const getTask = (id: string) => apiClient.getTask(id);
export const createTask = (task: CreateTaskRequest) =>
  apiClient.createTask(task);
export const updateTask = (id: string, updates: UpdateTaskRequest) =>
  apiClient.updateTask(id, updates);
export const deleteTask = (id: string) => apiClient.deleteTask(id);
export const getTasksByStatus = (status: Task['status']) =>
  apiClient.getTasksByStatus(status);
export const getTasksByPriority = (priority: Task['priority']) =>
  apiClient.getTasksByPriority(priority);
export const getUsers = () => apiClient.getUsers();
export const getUser = (id: string) => apiClient.getUser(id);
