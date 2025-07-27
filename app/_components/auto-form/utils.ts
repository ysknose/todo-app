import * as v from 'valibot';
import type { FieldConfig, FormConfig } from './types';

// スキーマからフィールド設定を自動推論するユーティリティ
export function inferFieldConfigFromSchema<T extends Record<string, any>>(
  schema: v.GenericSchema<T>,
  customConfigs?: Partial<Record<keyof T, Partial<FieldConfig>>>
): Record<keyof T, FieldConfig> {
  // 簡易的な実装（実際にはより複雑なスキーマ解析が必要）
  const defaultConfig: Record<string, FieldConfig> = {};

  // カスタム設定をマージ
  if (customConfigs) {
    Object.entries(customConfigs).forEach(([key, config]) => {
      if (config) {
        defaultConfig[key] = {
          type: config.type || 'text',
          label: config.label || formatLabel(key),
          placeholder: config.placeholder,
          description: config.description,
          options: config.options,
          required: config.required,
        };
      }
    });
  }

  return defaultConfig as Record<keyof T, FieldConfig>;
}

// ラベルをフォーマットする関数
export function formatLabel(fieldName: string): string {
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

// より簡単にフォームを作成するためのヘルパー関数
export function createAutoForm<T extends Record<string, any>>(
  schema: v.GenericSchema<T>,
  title: string,
  fieldConfigs: Partial<Record<keyof T, Partial<FieldConfig>>>,
  description?: string
): FormConfig<T> {
  return {
    schema,
    title,
    description,
    fields: inferFieldConfigFromSchema(schema, fieldConfigs),
  };
}
