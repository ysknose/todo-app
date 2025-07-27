'use client';

import { AutoFormFeatures, AutoFormGenerator } from '@/app/_components/auto-form';
import { toast } from 'sonner';
import {
  contactConfig,
  productConfig,
  userRegistrationConfig,
  type Contact,
  type Product,
  type UserRegistration,
} from './form-configs';

export default function AutoFormDemoPage() {
  const handleUserRegistration = async (data: UserRegistration) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('ユーザー登録データ:', data);
    toast.success('ユーザー登録が完了しました！', {
      description: `${data.name}さん、ありがとうございます。`,
    });
  };

  const handleProductRegistration = async (data: Product) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('商品登録データ:', data);
    toast.success('商品登録が完了しました！', {
      description: `${data.name}を登録しました。`,
    });
  };

  const handleContactSubmission = async (data: Contact) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('お問い合わせデータ:', data);
    toast.success('お問い合わせを受け付けました！', {
      description: `${data.name}さん、ありがとうございます。`,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🪄 自動フォームジェネレーター
        </h1>
        <p className="text-gray-600">
          型定義とスキーマからフォームを自動生成するデモ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <AutoFormGenerator
          config={userRegistrationConfig}
          onSubmit={handleUserRegistration}
          defaultValues={{
            name: '',
            email: '',
            age: 25,
            gender: 'male',
            interests: [],
            newsletter: false,
            bio: '',
          }}
        />

        <AutoFormGenerator
          config={productConfig}
          onSubmit={handleProductRegistration}
          defaultValues={{
            name: '',
            price: 0,
            category: 'electronics',
            description: '',
            inStock: true,
            featured: false,
          }}
        />

        <AutoFormGenerator
          config={contactConfig}
          onSubmit={handleContactSubmission}
          defaultValues={{
            name: '',
            email: '',
            subject: '',
            message: '',
            priority: 'medium',
            subscribe: false,
          }}
        />
      </div>

      <AutoFormFeatures />
    </div>
  );
}
