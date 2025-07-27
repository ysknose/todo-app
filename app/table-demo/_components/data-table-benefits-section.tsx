import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DataTableBenefitsSection() {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>🚀 DataTable共通化のメリット</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">✨ 設定オブジェクトだけで使用可能</h4>
            <div className="space-y-2 text-sm text-green-800">
              <p>• <strong>簡単設定:</strong> TableConfigオブジェクトを渡すだけでフル機能のテーブルが完成</p>
              <p>• <strong>型安全:</strong> TypeScriptでカラム設定やデータ型が完全に型チェック</p>
              <p>• <strong>再利用性:</strong> 他のエンティティでも同じコンポーネントを使用可能</p>
              <p>• <strong>一貫性:</strong> 全てのテーブルで同じUI/UXを提供</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">🎯 機能の標準化</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• <strong>ソート・フィルター:</strong> 全ての機能が自動で有効化</p>
              <p>• <strong>グループ化:</strong> 設定で簡単にグループ化オプションを追加</p>
              <p>• <strong>CRUD操作:</strong> onEdit, onDelete, onAddで操作を簡単に設定</p>
              <p>• <strong>カスタマイズ:</strong> cellレンダラーで表示をカスタマイズ可能</p>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2">🔧 開発効率の向上</h4>
            <div className="space-y-2 text-sm text-purple-800">
              <p>• <strong>コード削減:</strong> 1000行以上のテーブルコードが設定オブジェクトのみに</p>
              <p>• <strong>保守性:</strong> バグ修正や機能追加が一箇所で全テーブルに反映</p>
              <p>• <strong>テスト:</strong> 共通コンポーネントのテストで全機能をカバー</p>
              <p>• <strong>ドキュメント:</strong> 設定オブジェクトが仕様書の役割も果たす</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
