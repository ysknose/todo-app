# Todo App

Next.js 15.3.3 を使用したタスク管理アプリケーションのデモプロジェクトです。

## 機能

- **ドラッグ&ドロップ機能**: @dnd-kit/core を使用したタスクの並び替え
- **カンバンボード**: マルチコンテナでのタスク管理
- **JSON Server API**: RESTful API のモックサーバー
- **shadcn/ui**: モダンな UI コンポーネント
- **TypeScript**: 型安全な開発環境

## 技術スタック

- **フレームワーク**: Next.js 15.3.3 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4
- **UI ライブラリ**: shadcn/ui
- **ドラッグ&ドロップ**: @dnd-kit
- **API モック**: json-server
- **開発ツール**: Biome (Linter & Formatter)

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

#### Next.js サーバー起動（API 含む）

```bash
npm run dev
```

#### 旧版：JSON Server と Next.js を同時起動（非推奨）

```bash
npm run dev:all
```

#### 旧版：JSON Server のみ起動（非推奨）

```bash
npm run json-server
```

## デモページ

### 1. 基本的なソート機能 (`/dnd-demo`)

- シンプルなタスクリストのドラッグ&ドロップ
- 垂直方向のソート機能
- タスクの追加・リセット機能

### 2. カンバンボード (`/dnd-demo/multi-container`)

- TODO、進行中、完了の 3 つのコンテナ
- コンテナ間でのタスク移動
- 同一コンテナ内での並び替え
- ドラッグオーバーレイ表示

### 3. Next.js API Routes (`/api-demo`)

- Next.js API Routes を使用したタスク管理
- CRUD 操作（作成、読み取り、更新、削除）
- ステータス別・優先度別フィルタリング
- ファイルベースのデータ永続化

## API 仕様

### ベース URL

```
http://localhost:3000/api (Next.js サーバー内蔵API)
```

### エンドポイント

#### タスク関連

- `GET /api/tasks` - 全タスク取得
- `GET /api/tasks/:id` - 特定タスク取得
- `POST /api/tasks` - タスク作成
- `PATCH /api/tasks/:id` - タスク更新
- `DELETE /api/tasks/:id` - タスク削除
- `GET /api/tasks?status=todo` - ステータス別取得
- `GET /api/tasks?priority=high` - 優先度別取得

#### ユーザー関連

- `GET /api/users` - 全ユーザー取得

### データ構造

#### Task

```typescript
interface Task {
  id: string;
  content: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}
```

#### User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'developer' | 'designer' | 'manager';
}
```

## ディレクトリ構造

```
todo-app/
├── app/                    # Next.js App Router
│   ├── _components/        # プライベートコンポーネント
│   ├── _hooks/            # カスタムフック
│   ├── _lib/              # ユーティリティ・API
│   ├── _styles/           # スタイル
│   ├── api-demo/          # APIデモページ
│   ├── dnd-demo/          # ドラッグ&ドロップデモ
│   └── page.tsx           # ホームページ
├── components/            # shadcn/ui コンポーネント
├── hooks/                 # shadcn/ui フック
├── lib/                   # shadcn/ui ユーティリティ
├── db.json               # JSON Server データベース
└── package.json
```

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# JSON Server起動
npm run json-server

# 両方同時起動
npm run dev:all

# ビルド
npm run build

# 本番サーバー起動
npm run start

# リンター実行（Biome）
npm run lint

# リンター + 自動修正
npm run lint:fix

# フォーマット実行
npm run format
```

## ポート設定

- **Next.js**: http://localhost:3001
- **JSON Server**: http://localhost:3002

## 注意事項

- React 19 を使用しているため、一部のパッケージで依存関係の警告が表示される場合があります
- `--force`フラグを使用してインストールしてください
- JSON Server のデータは`db.json`ファイルに保存されます
- 開発中はデータの変更が自動的に保存されます
