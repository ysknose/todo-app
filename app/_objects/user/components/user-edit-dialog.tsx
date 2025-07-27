'use client';

import { type FormConfig } from '@/app/_components/auto-form';
import { EditDialog } from '@/app/_components/table';
import type { User } from '../types';
import { userEditSchema } from '../types/user';

// ユーザー編集用のフォーム設定
export const userEditConfig: FormConfig<User> = {
  schema: userEditSchema,
  title: 'ユーザー情報を編集',
  description: 'ユーザーの詳細情報を編集してください',
  fields: {
    id: {
      type: 'text',
      label: 'ユーザーID',
      placeholder: 'user-123',
      description: 'システムで自動生成されたIDです（編集不可）',
      required: true,
      disabled: true, // IDは編集不可
    },
    name: {
      type: 'text',
      label: '名前',
      placeholder: '山田太郎',
      required: true,
    },
    email: {
      type: 'email',
      label: 'メールアドレス',
      placeholder: 'example@email.com',
      required: true,
    },
    role: {
      type: 'select',
      label: '役割',
      placeholder: '役割を選択してください',
      options: [
        { value: 'admin', label: '管理者' },
        { value: 'user', label: 'ユーザー' },
        { value: 'viewer', label: '閲覧者' },
      ],
      required: true,
    },
    status: {
      type: 'select',
      label: 'ステータス',
      placeholder: 'ステータスを選択してください',
      options: [
        { value: 'active', label: '有効' },
        { value: 'inactive', label: '無効' },
      ],
      required: true,
    },
  },
};

interface UserEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (user: User) => Promise<void>;
}

export function UserEditDialog({
  isOpen,
  onClose,
  user,
  onSave,
}: UserEditDialogProps) {
  return (
    <EditDialog<User>
      isOpen={isOpen}
      onClose={onClose}
      data={user}
      formConfig={userEditConfig}
      onSave={onSave}
      title="ユーザー情報を編集"
      description="以下のフォームでユーザー情報を編集してください。"
    />
  );
}
