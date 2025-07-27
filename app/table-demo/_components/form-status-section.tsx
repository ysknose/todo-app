import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FormStatusSectionProps {
  form: any;
  fields: any[];
}

export function FormStatusSection({ form, fields }: FormStatusSectionProps) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>フォーム状態</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div>
            <strong>ユーザー数:</strong> {fields.length}
          </div>
          <div>
            <strong>バリデーション状態:</strong>
            <span className={form.formState.isValid ? 'text-green-600' : 'text-red-600'}>
              {form.formState.isValid ? ' ✓ 有効' : ' ✗ 無効'}
            </span>
          </div>
          <div>
            <strong>エラー数:</strong> {Object.keys(form.formState.errors).length}
          </div>
          <details className="mt-4">
            <summary className="cursor-pointer font-medium">現在のデータを表示</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(form.watch(), null, 2)}
            </pre>
          </details>
        </div>
      </CardContent>
    </Card>
  );
}
