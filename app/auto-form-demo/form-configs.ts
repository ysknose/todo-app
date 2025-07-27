import { createAutoForm, type FormConfig } from '@/app/_components/auto-form';
import * as v from 'valibot';

// 使用例1: ユーザー登録フォーム
export const userRegistrationSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(2, '名前は2文字以上で入力してください')
  ),
  email: v.pipe(
    v.string(),
    v.email('有効なメールアドレスを入力してください')
  ),
  age: v.pipe(
    v.number(),
    v.minValue(18, '18歳以上である必要があります')
  ),
  gender: v.picklist(['male', 'female', 'other'], '性別を選択してください'),
  interests: v.array(v.string()),
  newsletter: v.boolean(),
  bio: v.pipe(
    v.string(),
    v.minLength(10, '自己紹介は10文字以上で入力してください')
  ),
});

export type UserRegistration = v.InferInput<typeof userRegistrationSchema>;

export const userRegistrationConfig: FormConfig<UserRegistration> = {
  schema: userRegistrationSchema,
  title: 'ユーザー登録フォーム',
  description: '自動生成されたユーザー登録フォームです',
  fields: {
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
    age: {
      type: 'number',
      label: '年齢',
      placeholder: '25',
      required: true,
    },
    gender: {
      type: 'select',
      label: '性別',
      placeholder: '性別を選択してください',
      options: [
        { value: 'male', label: '男性' },
        { value: 'female', label: '女性' },
        { value: 'other', label: 'その他' },
      ],
      required: true,
    },
    interests: {
      type: 'text',
      label: '興味・関心',
      placeholder: 'プログラミング, デザイン, 音楽',
      description: 'カンマ区切りで入力してください',
    },
    newsletter: {
      type: 'checkbox',
      label: 'ニュースレターを受け取る',
    },
    bio: {
      type: 'textarea',
      label: '自己紹介',
      placeholder: 'あなたについて教えてください...',
      description: '10文字以上で入力してください',
      required: true,
    },
  },
};

// 使用例2: 商品登録フォーム
export const productSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, '商品名は必須です')),
  price: v.pipe(v.number(), v.minValue(0, '価格は0以上である必要があります')),
  category: v.picklist(['electronics', 'clothing', 'books', 'food'], 'カテゴリを選択してください'),
  description: v.pipe(v.string(), v.minLength(5, '説明は5文字以上で入力してください')),
  inStock: v.boolean(),
  featured: v.boolean(),
});

export type Product = v.InferInput<typeof productSchema>;

export const productConfig: FormConfig<Product> = {
  schema: productSchema,
  title: '商品登録フォーム',
  description: '新しい商品を登録します',
  fields: {
    name: {
      type: 'text',
      label: '商品名',
      placeholder: 'iPhone 15 Pro',
      required: true,
    },
    price: {
      type: 'number',
      label: '価格（円）',
      placeholder: '99800',
      required: true,
    },
    category: {
      type: 'select',
      label: 'カテゴリ',
      placeholder: 'カテゴリを選択',
      options: [
        { value: 'electronics', label: '電子機器' },
        { value: 'clothing', label: '衣類' },
        { value: 'books', label: '書籍' },
        { value: 'food', label: '食品' },
      ],
      required: true,
    },
    description: {
      type: 'textarea',
      label: '商品説明',
      placeholder: '商品の詳細説明を入力してください...',
      required: true,
    },
    inStock: {
      type: 'checkbox',
      label: '在庫あり',
    },
    featured: {
      type: 'checkbox',
      label: 'おすすめ商品',
    },
  },
};

// 使用例3: より簡単な記述での問い合わせフォーム
export const contactSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, '名前は必須です')),
  email: v.pipe(v.string(), v.email('有効なメールアドレスを入力してください')),
  subject: v.pipe(v.string(), v.minLength(1, '件名は必須です')),
  message: v.pipe(v.string(), v.minLength(10, 'メッセージは10文字以上で入力してください')),
  priority: v.picklist(['low', 'medium', 'high'], '優先度を選択してください'),
  subscribe: v.boolean(),
});

export type Contact = v.InferInput<typeof contactSchema>;

export const contactConfig = createAutoForm(
  contactSchema,
  'お問い合わせフォーム',
  {
    name: { type: 'text', label: 'お名前', placeholder: '山田太郎', required: true },
    email: { type: 'email', label: 'メールアドレス', placeholder: 'example@email.com', required: true },
    subject: { type: 'text', label: '件名', placeholder: 'お問い合わせ内容', required: true },
    message: {
      type: 'textarea',
      label: 'メッセージ',
      placeholder: 'お問い合わせ内容を詳しくお書きください...',
      description: '10文字以上で入力してください',
      required: true
    },
    priority: {
      type: 'select',
      label: '優先度',
      options: [
        { value: 'low', label: '低' },
        { value: 'medium', label: '中' },
        { value: 'high', label: '高' },
      ],
      required: true,
    },
    subscribe: { type: 'checkbox', label: 'メール配信を希望する' },
  },
  'お問い合わせやご質問をお送りください'
);
