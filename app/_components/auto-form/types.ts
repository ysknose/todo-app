import * as v from 'valibot';

// フィールドタイプの定義
export type FieldType = 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio';

// フィールド設定の型定義
export interface FieldConfig {
  type: FieldType;
  label: string;
  placeholder?: string;
  description?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
}

// フォーム設定の型定義
export interface FormConfig<T> {
  schema: v.GenericSchema<T>;
  fields: Record<keyof T, FieldConfig>;
  title: string;
  description?: string;
}

// AutoFormGeneratorコンポーネントのProps型
export interface AutoFormGeneratorProps<T extends Record<string, any>> {
  config: FormConfig<T>;
  onSubmit: (data: T) => void | Promise<void>;
  defaultValues?: Partial<T>;
}
