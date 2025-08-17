## ローカル開発環境のセットアップ

このプロジェクトはSupabaseエミュレーターを使用してローカル開発を行います。

### 前提条件

- Node.js (v18以上)
- Docker Desktop
- Supabase CLI

### 初期設定

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

### 日常的な開発作業

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

#### 1. アプリケーション
- **メインアプリ**: [http://localhost:3000](http://localhost:3000)
- **管理画面**: [http://localhost:3001](http://localhost:3001)

#### 2. Supabase Dashboard（データベーステーブル確認）
```bash
npm run dev:db:studio
```
または直接アクセス: **[http://127.0.0.1:54323](http://127.0.0.1:54323)**

Supabase Dashboardでは以下が確認できます：
- **Table Editor** - データベーステーブルの内容を表形式で確認・編集
- **SQL Editor** - SQLクエリの実行
- **API Logs** - APIアクセスログの確認
- **Authentication** - 認証設定

**テーブル確認手順：**
1. [http://127.0.0.1:54323](http://127.0.0.1:54323) にアクセス
2. 左サイドバーの「Table Editor」をクリック
3. `political_organizations` または `transactions` テーブルを選択

#### 3. データベーステーブル確認

作成されたテーブル：
- `political_organizations` - 政治団体情報
- `transactions` - 取引データ（マネーフォワードクラウドからのインポートデータ）

### 開発時のTips

- Supabaseエミュレーターは Docker を使用するため、Docker Desktop が起動している必要があります
- 初回起動時は Docker イメージのダウンロードに時間がかかる場合があります
- データベースの変更後は `npm run supabase:types` でTypeScript型定義を更新してください

### トラブルシューティング

#### Supabaseエミュレーターが起動しない場合
```bash
# Docker の状態確認
docker ps

# Supabase エミュレーター停止・再起動
npm run supabase:stop
npm run supabase:start
```

#### データベースの状態をリセットしたい場合
```bash
npm run supabase:reset
npm run prisma:migrate
npm run prisma:seed
```

## Apps

- User-facing app moved to `apps/user-facing-app`
  - dev: `cd apps/user-facing-app && npm run dev`
  - build: `npm run build`
- Managing app scaffold at `apps/managing-app`
  - dev: `cd apps/managing-app && npm run dev`
  - routes:
    - `/login` (dummy)
    - `/upload-csv` (simple file upload, counts lines)
