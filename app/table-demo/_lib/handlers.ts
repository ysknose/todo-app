import type { User } from '@/app/_objects/user/types';
import { toast } from 'sonner';
import { createNewUser, getInitialUsers } from './utils';

export type FormData = {
  users: User[];
};

export const createHandlers = (
  form: any,
  fields: any[],
  update: (index: number, user: User) => void,
  remove: (index: number) => void,
  append: (user: User) => void,
  setEditingUser: (user: User | null) => void,
  setIsEditDialogOpen: (value: boolean) => void
) => {
  const onSubmit = async (data: FormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success('ユーザーデータが正常に保存されました！', {
      description: `${data.users.length}件のユーザー情報を更新しました。`,
    });
  };

  const resetData = () => {
    form.reset({ users: getInitialUsers() });
    toast.info('データをリセットしました');
  };

  const handleSaveUser = async (updatedUser: User) => {
    try {
      const userIndex = fields.findIndex(field => field.id === updatedUser.id);

      if (userIndex !== -1) {
        update(userIndex, updatedUser);

        toast.success('ユーザー情報を更新しました！', {
          description: `${updatedUser.name}さんの情報が正常に更新されました。`,
        });
      } else {
        toast.error('ユーザーが見つかりませんでした。');
      }
    } catch (error) {
      toast.error('ユーザー情報の更新に失敗しました。');
    }
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingUser(null);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    const userIndex = fields.findIndex(field => field.id === user.id);
    if (userIndex !== -1) {
      remove(userIndex);
      toast.success(`${user.name}さんを削除しました`);
    }
  };

  const addUser = () => {
    const newUser = createNewUser();
    append(newUser);
  };

  return {
    onSubmit,
    resetData,
    handleSaveUser,
    handleCloseEditDialog,
    handleEditUser,
    handleDeleteUser,
    addUser,
  };
};
