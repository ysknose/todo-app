import type { User } from '../types';

// ユーザーラベル関連のユーティリティ
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

// カラムラベルのマッピング
export const getColumnLabel = (columnId: string) => {
  switch (columnId) {
    case 'name': return '名前';
    case 'email': return 'メールアドレス';
    case 'role': return '役割';
    case 'status': return 'ステータス';
    default: return columnId;
  }
};

// ユーザーデータのグループ化
export const getGroupedUserData = (users: User[], groupBy: string) => {
  if (!groupBy) return null;

  const grouped = users.reduce((acc, user) => {
    const groupValue = user[groupBy as keyof User];
    const groupLabel = groupBy === 'role' ? getRoleLabel(String(groupValue)) : getStatusLabel(String(groupValue));

    if (!acc[groupLabel]) {
      acc[groupLabel] = [];
    }
    acc[groupLabel].push(user);
    return acc;
  }, {} as Record<string, User[]>);

  return grouped;
};

// 初期ユーザーデータの生成
export const generateInitialUsers = (): User[] => {
  return [
    {
      id: 'user-1',
      name: '山田太郎',
      email: 'yamada@example.com',
      role: 'admin',
      status: 'active',
    },
    {
      id: 'user-2',
      name: '佐藤花子',
      email: 'sato@example.com',
      role: 'user',
      status: 'active',
    },
    {
      id: 'user-3',
      name: '田中次郎',
      email: 'tanaka@example.com',
      role: 'viewer',
      status: 'inactive',
    },
  ];
};
