import * as v from 'valibot';

// ユーザーデータの型定義
export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  status: 'active' | 'inactive';
};

// ユーザー編集用のValibotスキーマ
export const userEditSchema = v.object({
  id: v.string(),
  name: v.pipe(
    v.string(),
    v.minLength(1, '名前を入力してください'),
    v.maxLength(50, '名前は50文字以下で入力してください')
  ),
  email: v.pipe(
    v.string(),
    v.email('有効なメールアドレスを入力してください')
  ),
  role: v.picklist(['admin', 'user', 'viewer'], '役割を選択してください'),
  status: v.picklist(['active', 'inactive'], 'ステータスを選択してください'),
});

// フォーム用のスキーマ
export const userFormSchema = v.object({
  users: v.array(userEditSchema),
});

// 型推論
export type UserFormData = v.InferInput<typeof userFormSchema>;
