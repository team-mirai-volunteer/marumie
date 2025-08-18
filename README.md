## プロジェクト構成

このプロジェクトは以下のディレクトリ構成で構築されています：

### ディレクトリ構造

```
poli-money-alpha/
├── webapp/           # フロントエンド（一般ユーザー向け）
│   ├── src/
│   │   ├── app/      # Next.js App Router
│   │   └── components/
│   └── package.json
├── admin/            # 管理画面
│   ├── src/
│   │   ├── app/      # Next.js App Router
│   │   ├── client/   # クライアントサイドコンポーネント
│   │   └── server/   # サーバーサイドロジック
│   └── package.json
├── shared/           # 共通モデル・型定義
│   └── model/
├── supabase/         # Supabaseローカル開発環境設定
│   └── config.toml
├── prisma/           # データベーススキーマ・マイグレーション
│   ├── schema.prisma
│   └── migrations/
└── docs/             # 設計ドキュメント
```

### 各ディレクトリの役割

- **webapp/**: 一般ユーザー向けのフロントエンドアプリケーション（政治資金データの可視化）
- **admin/**: 管理者向けの管理画面（データ登録・管理機能）
- **shared/**: webapp と admin で共通して使用するモデルや型定義
- **supabase/**: Supabaseローカル開発環境の設定ファイル
- **prisma/**: データベーススキーマ定義とマイグレーションファイル
- **docs/**: プロジェクトの設計ドキュメント

## ローカル開発手順

このプロジェクトはSupabaseローカル開発環境を使用してローカル開発を行います。

### 開発環境セットアップ

1. **依存関係のインストール**
```bash
pnpm install
```

2. **Supabaseローカル開発環境の起動とデータベースセットアップ**
```bash
pnpm run dev:setup
```

このコマンドは以下を実行します：
- 依存関係のインストール
- Supabaseローカル開発環境の起動
- Prismaマイグレーションの実行
- シードデータの投入

### 開発サーバーの起動

#### 開発サーバーの起動

```bash
# Supabaseローカル開発環境と開発サーバーを同時に起動（推奨）
pnpm run dev

# または個別に起動
pnpm run supabase:start    # Supabaseローカル開発環境起動
pnpm run dev:webapp-only   # Next.js開発サーバーのみ起動
```

#### データベース管理

```bash
# Prismaマイグレーション実行
pnpm run prisma:migrate

# シードデータ投入
pnpm run prisma:seed

# データベースリセット（注意：全データが削除されます）
pnpm run supabase:reset
```

### ブラウザからの確認方法

- **メインアプリ**: [http://localhost:3000](http://localhost:3000)
- **管理画面**: [http://localhost:3001](http://localhost:3001)
- **Supabase Studio**: [http://127.0.0.1:54323](http://127.0.0.1:54323)
