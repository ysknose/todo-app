import type { User } from '@/app/_objects/user/types';
import type { ViewType } from './types';

export const getRoleLabel = (role: string) => {
  switch (role) {
    case 'admin': return '管理者';
    case 'user': return 'ユーザー';
    case 'viewer': return '閲覧者';
    default: return role;
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active': return '有効';
    case 'inactive': return '無効';
    default: return status;
  }
};

export const getRandomProgress = () => {
  return Math.floor(Math.random() * 60) + 40;
};

export const isValidViewType = (value: string): value is ViewType => {
  return ['table', 'kanban', 'gantt'].includes(value);
};

export const handleViewChange = (value: string): ViewType => {
  if (isValidViewType(value)) {
    return value;
  }
  return 'table' as ViewType; // デフォルト値
};

// ユーザーオブジェクトのファクトリー関数
export const createUser = (
  id: string,
  name: string = '',
  email: string = '',
  role: User['role'] = 'user',
  status: User['status'] = 'active'
): User => ({
  id,
  name,
  email,
  role,
  status,
});

// 新しいユーザーを作成（IDは自動生成）
export const createNewUser = (
  name: string = '',
  email: string = '',
  role: User['role'] = 'user',
  status: User['status'] = 'active'
): User => createUser(Date.now().toString(), name, email, role, status);

// 初期ユーザーデータを生成
export const getInitialUsers = (): User[] => [
  createUser('user-1', '山田太郎', 'yamada@example.com', 'admin', 'active'),
  createUser('user-2', '佐藤花子', 'sato@example.com', 'user', 'active'),
  createUser('user-3', '田中次郎', 'tanaka@example.com', 'viewer', 'inactive'),
];
