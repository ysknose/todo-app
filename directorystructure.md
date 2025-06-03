# ディレクトリ構成（※本記載は記入例です-プロジェクトに合わせて内容を更新してください-）

以下のディレクトリ構造に従って実装を行ってください：

```
/
├── app/                          # Next.jsのアプリケーションディレクトリ
│   ├── _components/              # プライベート: アプリケーションコンポーネント
│   │   ├── layout/               # レイアウト関連
│   │   └── ui/                   # 基本UI（button, card等）
│   ├── _hooks/                   # プライベート: カスタムフック
│   ├── _lib/                     # プライベート: ユーティリティ
│   │   ├── api/                  # API関連処理
│   │   │   ├── client.ts         # クライアント用関数
│   │   │   ├── server.ts         # サーバー用関数
│   │   │   ├── config.ts         # 環境設定
│   │   │   └── types.ts          # 型定義
│   │   └── utils/                # 共通関数
│   ├── _styles/                  # プライベート: スタイル定義
│   ├── api/                      # APIエンドポイント
│   │   └── [endpoint]/
│   │       └── route.ts
│   ├── favicon.ico               # ファビコン
│   ├── globals.css               # グローバルスタイル
│   ├── layout.tsx                # ルートレイアウト
│   └── page.tsx                  # ホームページ
├── components/                   # shadcn/uiのコンポーネント
│   ├── layout/
│   └── ui/
├── lib/                          # shadcn/uiのユーティリティ
├── hooks/                        # shadcn/uiのフック
├── public/                       # 静的ファイル
├── .cursor/                      # Cursor設定
├── .git/                         # Gitリポジトリ
├── node_modules/                 # 依存パッケージ
├── .gitignore                    # Git除外設定
├── eslint.config.mjs             # ESLint設定
├── next-env.d.ts                 # Next.js型定義
├── next.config.ts                # Next.js設定
├── package.json                  # プロジェクト設定
├── package-lock.json             # 依存関係ロックファイル
├── postcss.config.mjs            # PostCSS設定
└── tsconfig.json                 # TypeScript設定
```

### 配置ルール

- API エンドポイント → `app/api/[endpoint]/route.ts`
- UI コンポーネント → `app/_components/ui/`
- カスタムフック → `app/_hooks/`
- API 関連処理 → `app/_lib/api/`
- 共通処理 → `app/_lib/utils/`
- スタイル定義 → `app/_styles/`

### プライベートフォルダーの利点

- `_`プレフィックスのフォルダーはルーティングから**完全に除外**される
- URL としてアクセス不可能（SEO やセキュリティ向上）
- コードの整理とルーティングの分離が明確
- Next.js 公式推奨のベストプラクティス

### コロケーション例

```
app/dashboard/
├── _components/                  # ダッシュボード専用コンポーネント
├── _hooks/                       # ダッシュボード専用フック
├── _utils/                       # ダッシュボード専用ユーティリティ
├── analytics/                    # /dashboard/analytics ルート
├── settings/                     # /dashboard/settings ルート
├── layout.tsx                    # ダッシュボードレイアウト
└── page.tsx                      # /dashboard ページ
```
