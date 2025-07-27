import { toast } from 'sonner';
import type { User } from '../types';

// ユーザー編集のハンドラー
export const createUserEditHandler = (
  setEditingUser: (user: User | null) => void,
  setIsEditDialogOpen: (open: boolean) => void
) => {
  return (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };
};

// ユーザー保存のハンドラー
export const createUserSaveHandler = (
  form: any, // React Hook Formのform object
) => {
  return async (updatedUser: User) => {
    try {
      // フォーム内の該当ユーザーを更新
      const currentUsers = form.getValues('users');
      const userIndex = currentUsers.findIndex((u: User) => u.id === updatedUser.id);

      if (userIndex !== -1) {
        const newUsers = [...currentUsers];
        newUsers[userIndex] = updatedUser;
        form.setValue('users', newUsers);

        toast.success('ユーザー情報を更新しました！', {
          description: `${updatedUser.name}さんの情報が正常に更新されました。`,
        });
      }
    } catch (error) {
      toast.error('ユーザー情報の更新に失敗しました。');
      throw error; // エラーを再スローして呼び出し元で処理
    }
  };
};

// ダイアログクローズのハンドラー
export const createUserDialogCloseHandler = (
  setIsEditDialogOpen: (open: boolean) => void,
  setEditingUser: (user: User | null) => void
) => {
  return () => {
    setIsEditDialogOpen(false);
    setEditingUser(null);
  };
};
