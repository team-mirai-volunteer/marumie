## ローカル開発手順

このプロジェクトはSupabaseエミュレーターを使用してローカル開発を行います。

### 開発環境セットアップ

1. **依存関係のインストール**
```bash
npm install
```

2. **Supabaseエミュレーターの起動とデータベースセットアップ**
```bash
npm run dev:setup
```

このコマンドは以下を実行します：
- 依存関係のインストール
- Supabaseエミュレーターの起動
- Prismaマイグレーションの実行
- シードデータの投入

### 開発サーバーの起動

#### 開発サーバーの起動

```bash
# Supabaseエミュレーターと開発サーバーを同時に起動（推奨）
npm run dev

# または個別に起動
npm run supabase:start    # Supabaseエミュレーター起動
npm run dev:webapp-only   # Next.js開発サーバーのみ起動
```

#### データベース管理

```bash
# Prismaマイグレーション実行
npm run prisma:migrate

# シードデータ投入
npm run prisma:seed

# データベースリセット（注意：全データが削除されます）
npm run supabase:reset
```

### ブラウザからの確認方法

- **メインアプリ**: [http://localhost:3000](http://localhost:3000)
- **管理画面**: [http://localhost:3001](http://localhost:3001)
- **supabase emulator dashboard**: [http://127.0.0.1:54323](http://127.0.0.1:54323)
