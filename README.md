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

1. **初回セットアップ（推奨）**
```bash
pnpm run dev:setup
```
このコマンドで依存関係のインストール、データベースのリセット・マイグレーション・シードデータの投入を一括実行します。

2. **開発サーバーの起動**
```bash
pnpm run dev  # Webapp + 管理画面を同時起動（Supabase自動起動）
```

### よく使うコマンド

#### 開発関連
```bash
pnpm run dev           # Webapp + 管理画面を同時起動（推奨）
pnpm run dev:webapp    # Webappのみ起動
pnpm run dev:admin     # 管理画面のみ起動
```

#### データベース管理
```bash
pnpm run db:reset      # データベース完全リセット（データ削除 + マイグレーション + シード）
pnpm run db:migrate    # マイグレーション実行
pnpm run db:seed       # シードデータ投入
pnpm run db:studio     # Prisma Studio起動
```

#### コード品質チェック
```bash
pnpm run lint          # 全体のLint実行
pnpm run format        # コードフォーマット実行
pnpm run typecheck     # 型チェック実行
pnpm run test          # テスト実行
```

#### Supabase管理
```bash
pnpm run supabase:start   # Supabaseローカル環境起動
pnpm run supabase:stop    # Supabaseローカル環境停止
pnpm run supabase:status  # Supabase状態確認
```

#### ユーティリティ
```bash
pnpm run clean         # 全てのnode_modulesとSupabaseを停止
pnpm run fresh         # クリーンインストール + セットアップ
```

### ブラウザからの確認方法

- **メインアプリ**: [http://localhost:3000](http://localhost:3000)
- **管理画面**: [http://localhost:3001](http://localhost:3001)
- **Supabase Studio**: [http://127.0.0.1:54323](http://127.0.0.1:54323)
