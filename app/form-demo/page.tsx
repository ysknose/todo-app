'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as v from 'valibot';

// Valibotスキーマでバリデーションルールを定義
const formSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(2, '名前は2文字以上で入力してください'),
    v.maxLength(50, '名前は50文字以下で入力してください')
  ),
  email: v.pipe(
    v.string(),
    v.email('有効なメールアドレスを入力してください')
  ),
  age: v.pipe(
    v.number(),
    v.minValue(18, '18歳以上である必要があります'),
    v.maxValue(120, '有効な年齢を入力してください')
  ),
  category: v.pipe(
    v.string(),
    v.minLength(1, 'カテゴリを選択してください')
  ),
  priority: v.picklist(['low', 'medium', 'high'], '優先度を選択してください'),
  description: v.pipe(
    v.string(),
    v.minLength(10, '説明は10文字以上で入力してください'),
    v.maxLength(500, '説明は500文字以下で入力してください')
  ),
  agreeTerms: v.pipe(
    v.boolean(),
    v.check((val) => val === true, '利用規約に同意する必要があります')
  ),
  newsletter: v.optional(v.boolean(), false),
});

type FormData = v.InferInput<typeof formSchema>;

export default function FormDemoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: valibotResolver(formSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      age: 20,
      category: '',
      priority: 'medium',
      description: '',
      agreeTerms: false,
      newsletter: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    // 実際のAPIコールをシミュレート
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('フォームデータ:', data);
    toast.success('フォームが正常に送信されました！', {
      description: `${data.name}さん、ありがとうございます。`,
    });

    setIsSubmitting(false);
    form.reset();
  };

  const resetForm = () => {
    form.reset();
    toast.info('フォームをリセットしました');
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          React Hook Form デモ
        </h1>
        <p className="text-gray-600">
          React Hook Form + Valibot + shadcn/ui を使用したフォームサンプル
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ユーザー登録フォーム</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* 名前 */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>名前 *</FormLabel>
                    <FormControl>
                      <Input placeholder="山田太郎" {...field} />
                    </FormControl>
                    <FormDescription>
                      2文字以上50文字以下で入力してください
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* メールアドレス */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 年齢 */}
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>年齢 *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>18歳以上である必要があります</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* カテゴリ（セレクト） */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>カテゴリ *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="カテゴリを選択してください" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="developer">開発者</SelectItem>
                        <SelectItem value="designer">デザイナー</SelectItem>
                        <SelectItem value="manager">マネージャー</SelectItem>
                        <SelectItem value="student">学生</SelectItem>
                        <SelectItem value="other">その他</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 優先度（ラジオボタン） */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>優先度 *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="low" id="low" />
                          <Label htmlFor="low">低</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label htmlFor="medium">中</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="high" id="high" />
                          <Label htmlFor="high">高</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 説明（テキストエリア） */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>自己紹介 *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="あなたについて教えてください..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      10文字以上500文字以下で入力してください
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 利用規約（チェックボックス必須） */}
              <FormField
                control={form.control}
                name="agreeTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        利用規約に同意します *
                      </FormLabel>
                      <FormDescription>
                        サービスの利用規約とプライバシーポリシーに同意してください
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {/* ニュースレター（チェックボックス任意） */}
              <FormField
                control={form.control}
                name="newsletter"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        ニュースレターを受け取る
                      </FormLabel>
                      <FormDescription>
                        新機能やお得な情報をメールでお知らせします
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {/* ボタン */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      送信中...
                    </>
                  ) : (
                    '送信'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  リセット
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* フォームの状態表示（開発用） */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>フォーム状態（開発用）</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <strong>バリデーション状態:</strong>
              <span className={form.formState.isValid ? 'text-green-600' : 'text-red-600'}>
                {form.formState.isValid ? ' ✓ 有効' : ' ✗ 無効'}
              </span>
            </div>
            <div>
              <strong>エラー数:</strong> {Object.keys(form.formState.errors).length}
            </div>
            <div>
              <strong>変更されたフィールド:</strong> {Object.keys(form.formState.dirtyFields).length}
            </div>
            <details className="mt-4">
              <summary className="cursor-pointer font-medium">現在の値を表示</summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                {JSON.stringify(form.watch(), null, 2)}
              </pre>
            </details>
          </div>
        </CardContent>
      </Card>

      {/* 使用例の説明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Valibot の特徴</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• <strong>軽量:</strong> Zodと比較して約10倍軽量（約2KB）</p>
            <p>• <strong>高性能:</strong> 最適化されたバリデーション処理</p>
            <p>• <strong>TypeScript完全対応:</strong> 優れた型推論とエラー検出</p>
            <p>• <strong>モジュラー設計:</strong> 必要な機能のみをインポート可能</p>
            <p>• <strong>パイプライン API:</strong> 直感的で読みやすいスキーマ定義</p>
            <p>• <strong>React Hook Form統合:</strong> valibotResolverでシームレス統合</p>
            <p>• <strong>Tree Shaking対応:</strong> 未使用コードの自動削除でバンドルサイズ最小化</p>
          </div>
        </CardContent>
      </Card>

      {/* バリデーション動作の説明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>バリデーション動作について</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div>
              <strong className="text-gray-900">onTouched モード:</strong>
              <p>フィールドに一度フォーカスして離れた後にバリデーションを実行します。</p>
              <p className="text-xs text-gray-500 mt-1">
                → ユーザーがまだ触っていないフィールドにはエラーを表示しません
              </p>
            </div>
            <div>
              <strong className="text-gray-900">onChange 再バリデーション:</strong>
              <p>一度エラーが表示された後は、入力変更時にリアルタイムで再バリデーションします。</p>
              <p className="text-xs text-gray-500 mt-1">
                → エラー修正時に即座にフィードバックを提供
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <strong className="text-blue-900">UX改善のポイント:</strong>
              <ul className="mt-1 space-y-1 text-blue-800 text-xs">
                <li>• フィールドに触れる前はエラーを表示しない</li>
                <li>• 入力中は邪魔しない</li>
                <li>• エラー修正時は即座にフィードバック</li>
                <li>• フォーム送信時のみ全体をチェック</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zod vs Valibot比較 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Zod vs Valibot 比較</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">項目</th>
                  <th className="text-left p-2">Zod</th>
                  <th className="text-left p-2">Valibot</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-medium">バンドルサイズ</td>
                  <td className="p-2">~25KB</td>
                  <td className="p-2 text-green-600">~2KB</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">パフォーマンス</td>
                  <td className="p-2">良い</td>
                  <td className="p-2 text-green-600">より高速</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">API設計</td>
                  <td className="p-2">チェーンAPI</td>
                  <td className="p-2 text-green-600">パイプライン API</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Tree Shaking</td>
                  <td className="p-2">部分的</td>
                  <td className="p-2 text-green-600">完全対応</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">エコシステム</td>
                  <td className="p-2 text-blue-600">成熟</td>
                  <td className="p-2">成長中</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
