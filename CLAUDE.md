# Claude Code 設定

## 設計作業ルール

設計作業を依頼された場合は、以下のルールに従ってファイルを作成すること：

- ファイル名: `YYYYMMDD_HHMM_{日本語の作業内容}.md`
- 保存場所: `docs/` 以下
- フォーマット: Markdown

例: `docs/20250815_1430_ユーザー認証システム設計.md`

## webapp コーディングルール

webapp 内のページおよびコンポーネントファイルには、必ず以下のいずれかの import を先頭に追加すること：

- **サーバーコンポーネント（ページファイル、サーバーサイドで実行されるコンポーネント）**: `import "server-only";`
- **クライアントコンポーネント（'use client'を使用するコンポーネント）**: `import "client-only";`

### 適用対象

- `webapp/src/app/**/page.tsx` - サーバーコンポーネントページ
- `webapp/src/client/components/**/*.tsx` - クライアントコンポーネント

### 例

```typescript
// サーバーコンポーネントの場合
import "server-only";
import Link from "next/link";

export default async function Page() {
  // ...
}

// クライアントコンポーネントの場合
("use client");
import "client-only";

export default function ClientComponent() {
  // ...
}
```

見た目の定義のみを行うコンポーネントなど、サーバー・クライアントどちらで呼ばれても問題ないものには追加不要。

## webapp のデータ取得アーキテクチャルール

データ取得は、基本的には以下の設計パターンに従うこと。
（ごく軽い処理については別のパターンを利用してもよい。）

### 基本フロー

```
初回読み込み: Browser → Action → Usecase
動的更新: Browser → API Route → Action → Usecase
```

### 実装ルール

1. **初回読み込み**: SSR で Server Action を直接呼び出す
2. **動的更新**: ユーザーインタラクションによるデータ更新は API Route を作成し、**SSR 用と同一の Action** を呼び出す
3. **ビジネスロジック集約**: 全てのデータ処理は Usecase 層で実装する

### 理由

- **統一性**: データ取得ロジックが Action に集約され、重複を回避
- **保守性**: ビジネスロジック変更時の影響範囲を最小化
- **柔軟性**: SSR/SPA の選択を実装後でも変更可能
- **キャッシュ効率**: Next.js のキャッシュ機能を最大限活用

## admin code structure

similar to the webapp, we will go with a code structure like below

- app
- client
- server

### responsiblities

under each directory will be like the below

- app
  - app router, follows url directory of the website
  - api, getting data, may refactor later
- client
  - client components
- server
  - lib
    - data wrangling
  - repositories
    - prisma stuff
  - usecases
    - top level functions to be called by app
  - auth
    - auth related stuff
