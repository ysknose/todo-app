import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AutoFormFeatures() {
  return (
    <>
      {/* 機能説明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>🚀 自動フォームジェネレーターの特徴</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">型安全性</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <p>• TypeScript + Valibotで完全な型安全性を保証</p>
                <p>• コンパイル時に型エラーを検出</p>
                <p>• 実行時バリデーションとの整合性</p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">自動生成機能</h4>
              <div className="space-y-2 text-sm text-green-800">
                <p>• 型定義からフィールドタイプを自動判定</p>
                <p>• バリデーションルールの自動適用</p>
                <p>• レスポンシブレイアウトの自動調整</p>
                <p>• エラーメッセージの自動表示</p>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">カスタマイズ性</h4>
              <div className="space-y-2 text-sm text-purple-800">
                <p>• フィールド設定の柔軟なカスタマイズ</p>
                <p>• ラベル・プレースホルダー・説明文の設定</p>
                <p>• セレクトボックスのオプション設定</p>
                <p>• 必須フィールドの指定</p>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">開発効率</h4>
              <div className="space-y-2 text-sm text-orange-800">
                <p>• ボイラープレートコードの削減</p>
                <p>• 一貫したフォームデザイン</p>
                <p>• 保守性の向上</p>
                <p>• 迅速なプロトタイピング</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 使用方法 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>📝 使用方法</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">1. スキーマ定義</h4>
              <pre className="text-xs bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto">
{`const userSchema = v.object({
  name: v.pipe(v.string(), v.minLength(2)),
  email: v.pipe(v.string(), v.email()),
  age: v.pipe(v.number(), v.minValue(18)),
});`}
              </pre>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">2. フィールド設定</h4>
              <pre className="text-xs bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto">
{`const config: FormConfig<User> = {
  schema: userSchema,
  title: 'ユーザー登録',
  fields: {
    name: { type: 'text', label: '名前', required: true },
    email: { type: 'email', label: 'メール', required: true },
    age: { type: 'number', label: '年齢', required: true },
  },
};`}
              </pre>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">3. フォーム使用</h4>
              <pre className="text-xs bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto">
{`<AutoFormGenerator
  config={config}
  onSubmit={handleSubmit}
  defaultValues={defaultValues}
/>`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
