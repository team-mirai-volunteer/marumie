### Admin アプリの認証セットアップ (Simple Auth)

この管理画面はシンプルな Supabase 認証を導入しています。ログインしないと画面を閲覧できません。

#### セットアップ方法

ローカル開発環境では、データベースシードで自動的にテストユーザーが作成されます：

```bash
# プロジェクトルートから
pnpm db:seed
```

これで以下のテストユーザーが作成されます：
- **Email**: `foo@example.com`
- **Password**: `bar@example.com`

**環境変数を設定する**
   - `./admin/.env.example` を `./admin/.env.local` にコピー
   - `SUPABASE_URL` と `SUPABASE_ANON_KEY` を設定（クライアント側には公開しません）
   - 値は Supabase ダッシュボード → Settings → API から取得できます（Project URL と anon key）

```bash
cp ./admin/.env.example ./admin/.env.local
# .env.local を開いて URL と anon key を設定
```


#### よくあるエラー

- 「Your project's URL and Key are required to create a Supabase client!」
  - `SUPABASE_URL` または `SUPABASE_ANON_KEY` が設定されていません。
  - `./admin/.env.local` を見直し、開発サーバーを再起動してください。

#### オプション

- 招待 API（`POST /api/invite`）を使う場合は、`SUPABASE_SERVICE_ROLE_KEY` も設定してください（Settings → API の service_role key）。
- DB を使う管理機能（団体・取引の閲覧/CSV 取込など）を動かす場合は、Prisma の接続文字列も `./admin/.env.local` に設定してください。
  - `DATABASE_URL` と `DIRECT_URL`（Supabase Postgres の接続文字列。Settings → Database 参照）

#### 備考

Monorepo 直下の `.env` ではなく、Next.js の動作上 `./admin/.env.local` に置く必要があります。セットアップは今後自動化・ドキュメント整備を進めていきます。

---
