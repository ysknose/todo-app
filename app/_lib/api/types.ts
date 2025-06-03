// 変更禁止: 型定義

export interface Task {
  id: string;
  content: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'developer' | 'designer' | 'manager';
}

export interface CreateTaskRequest {
  content: string;
  status?: Task['status'];
  priority?: Task['priority'];
}

export interface UpdateTaskRequest {
  content?: string;
  status?: Task['status'];
  priority?: Task['priority'];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 共通のエンティティ型
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Todo extends BaseEntity {
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
}

// データベース構造
export interface Database {
  tasks: Task[];
  users: User[];
}
