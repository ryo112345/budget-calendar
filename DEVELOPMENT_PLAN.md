# budget-calendar 開発スケジュール

カレンダー形式で予算管理を行うアプリケーション

## プロジェクトの目的

### 主目的：学習
このプロジェクトは **Go + React のフルスタック開発を学習するための教材** として進めています。

- 既存プロジェクト（`household-budget`）の構成を参考にしながら、同様のアーキテクチャを理解する
- 実際に手を動かして、段階的に機能を実装していく
- 各実装の意味や目的を理解しながら進める

### 学習方針

#### 1. 少しずつ実装する
- 一度に大量のコードを書かず、**1ファイルずつ**または**1機能ずつ**実装
- 各ステップで「何をしたか」「なぜそうするのか」を理解してから次に進む
- 疑問点があれば都度確認

#### 2. 実装について説明する
- 新しい概念（GORM、マイグレーション、ハンドラーなど）が出てきたら説明する
- コードの各部分の役割を明確にする
- 「なぜこの設計にするのか」を理解する

#### 3. コマンドは自分で打つ
- Docker、マイグレーション、Gitなどのコマンドは基本的に自分で実行
- コマンドの意味を理解してから実行する
- ただし、ファイル作成・編集などのコーディング部分はアシスタントが行う

#### 4. 既存プロジェクトとの比較
- `household-budget` プロジェクトの実装を参考にする
- 違いがあれば「なぜ違うのか」「どちらが良いのか」を考える
- ベストプラクティスを学ぶ

### 成果物
学習を通じて、以下のスキルを習得することを目指します：
- Go言語の基本（構造体、パッケージ、エラーハンドリング）
- Echoフレームワークを使ったAPI開発
- GORMによるデータベース操作
- sql-migrateを使ったマイグレーション管理
- Dockerを使った開発環境構築
- レイヤードアーキテクチャ（Handler → Service → Model）
- 認証・認可の実装
- テスト駆動開発（TDD）

## 技術構成（household-budgetを踏襲）

### フロントエンド
- vite
- react(v19)
- react-router(v7)
- orval
- tailwindcss
- tanstack/react-query
- fullcalendar
- eslint
- prettier
- playwright

### バックエンド
- go(v1.24系)
- gorm
- sql-migrate
- echo
- oapi-codegen
- air
- ozzo-validation
- godotenv
- go-txdb
- stretchr/testify
- go-randomdata
- factory-go/factory

### インフラ
- TiDB
- Artifact Registry
- Cloud Run
- Cloud Storage

### OpenAPIのスキーマ管理
- Typespec

---

## 現在の実装状況

### バックエンド（api-server）- ✅ ほぼ完成

```
api-server/
├── cmd/server/main.go           # エントリーポイント
├── apis/openapi.go              # oapi-codegen生成コード
├── database/database.go         # GORM DB接続
├── internal/
│   ├── handlers/                # HTTPハンドラー
│   │   ├── main_handler.go      # 統合ハンドラー
│   │   ├── users_handler.go     # 認証（SignUp, SignIn, CheckSignedIn）
│   │   ├── categories_handler.go
│   │   ├── budgets_handler.go
│   │   ├── transactions_handler.go
│   │   └── csrf_handler.go
│   ├── services/                # ビジネスロジック
│   │   ├── user_service.go
│   │   ├── category_service.go
│   │   ├── budget_service.go
│   │   └── transaction_service.go
│   ├── models/                  # GORMモデル
│   │   ├── user.go
│   │   ├── category.go
│   │   ├── budget.go
│   │   └── transaction.go
│   ├── validators/              # バリデーション
│   │   ├── user_validator.go
│   │   ├── category_validator.go
│   │   ├── budget_validator.go
│   │   └── transaction_validator.go
│   ├── middlewares/             # ミドルウェア
│   │   ├── register.go
│   │   ├── auth_middleware.go   # JWT認証
│   │   └── csrf_middleware.go   # CSRF保護
│   └── helpers/
│       ├── auth_helper.go
│       └── validation_helper.go
└── test/                        # ※未実装
    └── factories/
```

**実装済みAPI:**
- `POST /users/signUp` - 会員登録
- `POST /users/signIn` - ログイン
- `GET /users/checkSignedIn` - 認証状態確認
- `GET/POST/PATCH/DELETE /categories` - カテゴリCRUD
- `GET/POST/PATCH/DELETE /transactions` - 取引CRUD（フィルタリング対応）
- `GET/POST/PATCH/DELETE /budgets` - 予算CRUD（月・カテゴリフィルタ対応）
- `GET /csrf` - CSRFトークン取得

### フロントエンド（frontend）- 🔄 基盤のみ完成

```
frontend/
├── app/
│   ├── root.tsx                 # ルートレイアウト（QueryClient, ErrorBoundary設定済み）
│   ├── routes.ts                # ルート定義（/, /sign_up, /sign_in, /calendar）
│   ├── routes/
│   │   └── home.tsx             # ホームページ（シンプルな表示のみ）
│   └── app.css                  # Tailwind CSS
├── apis/                        # Orval生成済みAPIクライアント
│   ├── budgets/budgets.ts       # useGetBudgets, usePostBudgets等
│   ├── categories/categories.ts
│   ├── transactions/transactions.ts
│   ├── users/users.ts           # usePostUsersSignIn, usePostUsersSignUp等
│   ├── csrf/csrf.ts
│   └── model/                   # TypeScript型定義（35+ファイル）
├── api-spec/                    # TypeSpec定義
│   ├── routes/
│   ├── models/
│   └── tsp-output/schema/openapi.yaml
├── custom-fetch.ts              # API呼び出しラッパー（credentials: include設定済み）
├── orval.config.ts              # Orval設定
├── vite.config.ts
├── react-router.config.ts       # SSR無効化設定
└── package.json                 # 依存関係インストール済み
```

**設定済み:**
- React 19, React Router 7, Vite, TypeScript
- TailwindCSS 4
- TanStack React Query
- Orval（APIクライアント自動生成）
- FullCalendar（未使用）
- ErrorBoundary

**未実装:**
- 認証UI（/sign_up, /sign_in）
- 認証Context・ミドルウェア
- カレンダーページ
- 共通コンポーネント
- features構造
- servicesラッパー

---

## フェーズ1: 基盤構築

### ✅ 1-1. プロジェクト初期設定 (完了)
- [x] ディレクトリ構成作成
- [x] Docker環境セットアップ
- [x] Git リポジトリ初期化

### ✅ 1-2. バックエンド基盤 (完了)
- [x] Go プロジェクト初期化
- [x] DB接続とマイグレーション環境
- [x] 環境変数管理
- [x] モデル定義（User, Category, Budget, Transaction）

### ✅ 1-3. CRUD API実装 (完了)
- [x] Categories API（CRUD）
- [x] Transactions API（CRUD + フィルタリング）
- [x] Budgets API（CRUD + フィルタリング）
- [x] CSRF API

### ✅ 1-4. 認証機能実装 (完了)
- [x] 会員登録機能（POST /users/signUp）
- [x] ログイン機能（POST /users/signIn）
- [x] 認証状態確認（GET /users/checkSignedIn）
- [x] JWT認証ミドルウェア
- [x] CSRF保護

### ✅ 1-5. フロントエンド基盤 (完了)
- [x] Vite + React + TypeScript 初期化
- [x] React Router v7 設定
- [x] Tailwind CSS セットアップ
- [x] React Query 設定
- [x] Orval セットアップ（APIクライアント生成）
- [x] TypeSpec セットアップ（OpenAPI生成）
- [x] custom-fetch.ts（認証ヘッダー付与）
- [x] ErrorBoundary設定

### 🔄 1-6. フロントエンド認証UI (次のステップ)

household-budgetの構成に合わせて実装する。

#### Step 1: ディレクトリ構造作成
```
frontend/
├── components/              # 共通コンポーネント
│   ├── BaseButton/
│   │   └── index.tsx
│   ├── BaseContainer/
│   │   └── index.tsx
│   ├── BaseFormInput/
│   │   └── index.tsx
│   └── BaseFormSelect/
│       └── index.tsx
├── contexts/                # React Context
│   └── useAuthContext.tsx   # 認証状態管理
├── hooks/                   # 共通フック
│   └── useAuth.ts           # 認証同期フック
├── middlewares/             # React Router ミドルウェア
│   ├── auth-middleware.ts   # 認証チェック・リダイレクト
│   └── auth-context.ts      # ミドルウェア用Context
├── services/                # APIサービスラッパー
│   ├── base/
│   │   └── api.ts           # 共通ヘッダー（X-CSRF-Token）
│   ├── users/
│   │   ├── api.ts           # signIn, signUp, checkSignedIn
│   │   └── index.ts         # React Query hooks
│   └── csrf/
│       └── api.ts           # getCsrfToken
├── features/                # 機能別モジュール
│   ├── sign-in/
│   │   ├── components/
│   │   │   └── SignInForm/
│   │   │       └── index.tsx
│   │   └── hooks/
│   │       └── useSignIn.ts
│   └── sign-up/
│       ├── components/
│       │   └── SignUpForm/
│       │       └── index.tsx
│       └── hooks/
│           └── useSignUp.ts
├── lib/                     # ユーティリティ
│   └── date.ts              # 日付フォーマット
└── app/
    ├── sign_in/
    │   └── page.tsx         # ログインページ
    ├── sign_up/
    │   └── page.tsx         # 会員登録ページ
    └── HeaderNavigation.tsx  # ヘッダー（認証状態に応じた表示）
```

#### Step 2: 共通コンポーネント作成
- [ ] `components/BaseButton/index.tsx` - ボタンコンポーネント
- [ ] `components/BaseContainer/index.tsx` - レイアウトラッパー
- [ ] `components/BaseFormInput/index.tsx` - フォーム入力（バリデーションエラー表示対応）
- [ ] `components/BaseFormSelect/index.tsx` - セレクトボックス

#### Step 3: 認証基盤作成
- [ ] `contexts/useAuthContext.tsx` - 認証Context（isSignedIn, csrfToken）
- [ ] `hooks/useAuth.ts` - ミドルウェアからContextへの同期
- [ ] `middlewares/auth-context.ts` - unstable_createContext
- [ ] `middlewares/auth-middleware.ts` - ルート保護・リダイレクト
- [ ] `app/root.tsx` 更新 - AuthProvider追加、ミドルウェア適用

#### Step 4: APIサービスラッパー作成
- [ ] `services/base/api.ts` - getRequestHeaders（CSRF）
- [ ] `services/csrf/api.ts` - getCsrfToken
- [ ] `services/users/api.ts` - signIn, signUp, checkSignedIn
- [ ] `services/users/index.ts` - usePostSignIn, usePostSignUp

#### Step 5: 会員登録機能
- [ ] `features/sign-up/hooks/useSignUp.ts` - フォーム状態・バリデーション
- [ ] `features/sign-up/components/SignUpForm/index.tsx` - フォームUI
- [ ] `app/sign_up/page.tsx` - ページコンポーネント

#### Step 6: ログイン機能
- [ ] `features/sign-in/hooks/useSignIn.ts` - フォーム状態・バリデーション
- [ ] `features/sign-in/components/SignInForm/index.tsx` - フォームUI
- [ ] `app/sign_in/page.tsx` - ページコンポーネント

#### Step 7: ヘッダー・ナビゲーション
- [ ] `app/HeaderNavigation.tsx` - 認証状態に応じたナビ表示
- [ ] `app/root.tsx` 更新 - ヘッダー組み込み

---

## フェーズ2: カレンダー機能

### 2-1. カレンダーページ基盤

#### Step 1: ディレクトリ構造
```
frontend/
├── features/
│   └── calendar/
│       ├── components/
│       │   ├── CalendarView/
│       │   │   └── index.tsx        # FullCalendar統合
│       │   ├── TransactionModal/
│       │   │   └── index.tsx        # 取引作成/編集モーダル
│       │   └── DaySummary/
│       │       └── index.tsx        # 日別サマリー表示
│       └── hooks/
│           ├── useCalendar.ts       # カレンダー状態管理
│           └── useTransactionForm.ts # フォーム状態
├── services/
│   ├── transactions/
│   │   ├── api.ts
│   │   └── index.ts
│   ├── categories/
│   │   ├── api.ts
│   │   └── index.ts
│   └── budgets/
│       ├── api.ts
│       └── index.ts
└── app/
    └── calendar/
        └── page.tsx
```

#### Step 2: APIサービス作成
- [ ] `services/transactions/api.ts` - getTransactions, createTransaction等
- [ ] `services/transactions/index.ts` - useGetTransactions, usePostTransaction等
- [ ] `services/categories/api.ts` - getCategories
- [ ] `services/categories/index.ts` - useGetCategories

#### Step 3: カレンダー表示
- [ ] `features/calendar/components/CalendarView/index.tsx`
  - FullCalendar + React統合
  - 日本語ロケール
  - Tailwindスタイリング
  - 取引データをイベントとして表示
- [ ] `features/calendar/hooks/useCalendar.ts`
  - 表示月の状態管理
  - 取引データ取得（日付範囲フィルタ）

#### Step 4: 取引作成・編集
- [ ] `features/calendar/components/TransactionModal/index.tsx`
  - 日付選択（カレンダークリックで自動入力）
  - カテゴリ選択
  - 金額入力
  - 収入/支出タイプ選択
  - 説明入力
  - バリデーションエラー表示
- [ ] `features/calendar/hooks/useTransactionForm.ts`
  - フォーム状態管理
  - 作成/編集/削除処理
  - React Query Mutation

#### Step 5: カレンダーページ
- [ ] `app/calendar/page.tsx`
  - 認証必須（ミドルウェアで保護）
  - CalendarView + TransactionModal統合
  - 月ナビゲーション（前月/次月/今月）

### 2-2. 日別・月別サマリー

- [ ] `features/calendar/components/DaySummary/index.tsx`
  - 選択日の収入/支出合計
  - カテゴリ別内訳
- [ ] 月間サマリー表示（カレンダー上部）
  - 月間収入合計
  - 月間支出合計
  - 収支バランス

### 2-3. 予算管理機能

#### Step 1: 予算設定UI
```
frontend/
├── features/
│   └── budget/
│       ├── components/
│       │   ├── BudgetList/
│       │   │   └── index.tsx        # 月別予算一覧
│       │   ├── BudgetForm/
│       │   │   └── index.tsx        # 予算設定フォーム
│       │   └── BudgetProgress/
│       │       └── index.tsx        # 予算消化状況
│       └── hooks/
│           └── useBudget.ts
└── app/
    └── budget/
        └── page.tsx
```

- [ ] `services/budgets/api.ts` - getBudgets, createBudget等
- [ ] `services/budgets/index.ts` - useGetBudgets, usePostBudget等
- [ ] `features/budget/components/BudgetList/index.tsx`
- [ ] `features/budget/components/BudgetForm/index.tsx`
- [ ] `features/budget/components/BudgetProgress/index.tsx` - 予算vs実績

---

## フェーズ3: テストとCI/CD

### 3-1. バックエンドテスト
- [ ] テストディレクトリ構造作成
  ```
  api-server/
  └── test/
      └── factories/
          ├── user.go
          ├── category.go
          ├── budget.go
          └── transaction.go
  ```
- [ ] `internal/handlers/with_db_suite.go` - テストベーススイート
- [ ] go-txdb設定（トランザクションスコープDB）
- [ ] factory-go でテストデータ生成
- [ ] ハンドラーテスト作成
  - [ ] users_handler_test.go
  - [ ] categories_handler_test.go
  - [ ] transactions_handler_test.go
  - [ ] budgets_handler_test.go

### 3-2. E2Eテスト
- [ ] Playwright セットアップ
- [ ] テストシナリオ
  - 会員登録 → ログイン
  - カテゴリ作成
  - 取引作成・編集・削除
  - カレンダー月ナビゲーション
  - 予算設定

### 3-3. CI/CD
- [ ] `.github/workflows/api-lint-and-test.yml`
- [ ] `.github/workflows/frontend-lint.yaml`
- [ ] `.github/workflows/e2e.yaml`
- [ ] codecov統合

---

## フェーズ4: 本番デプロイ

### 4-1. 本番環境構築
- [ ] Cloud Run デプロイ設定
- [ ] TiDB Cloud セットアップ
- [ ] Secret Manager 設定
- [ ] 本番用Dockerfile

### 4-2. ドメイン・SSL設定
- [ ] カスタムドメイン設定
- [ ] SSL証明書

---

## 設計方針（household-budgetを踏襲）

### フロントエンド

#### ディレクトリ構成
```
frontend/
├── app/                # ページコンポーネント（React Router v7）
├── features/           # 機能別モジュール
│   └── [feature]/
│       ├── components/ # 機能専用コンポーネント
│       ├── hooks/      # 機能専用フック
│       └── services/   # 機能専用APIサービス（必要に応じて）
├── components/         # 共通コンポーネント
├── contexts/           # React Context
├── hooks/              # 共通フック
├── middlewares/        # React Router ミドルウェア
├── services/           # APIサービスラッパー
├── apis/               # Orval生成（自動生成、編集しない）
├── lib/                # ユーティリティ関数
└── const/              # 定数
```

#### 設計ルール
1. **ロジックはhooksに分離** - コンポーネントはUIに集中
2. **APIサービスラッパー** - Orval生成コードを直接使わず、servicesでラップ
3. **React Query活用** - サーバー状態はReact Queryで管理
4. **認証はContext経由** - useAuthContext()でcsrfToken, isSignedInにアクセス
5. **ルート保護はミドルウェア** - auth-middleware.tsで認証チェック

### バックエンド

#### ディレクトリ構成
```
api-server/
├── cmd/server/         # エントリーポイント
├── apis/               # oapi-codegen生成
├── database/           # DB接続
├── internal/
│   ├── handlers/       # HTTPハンドラー
│   ├── services/       # ビジネスロジック
│   ├── models/         # GORMモデル
│   ├── validators/     # バリデーション
│   ├── middlewares/    # ミドルウェア
│   └── helpers/        # ユーティリティ
└── test/
    └── factories/      # テストデータファクトリ
```

#### 設計ルール
1. **Handler → Service** - Handlerは薄く、ロジックはServiceに
2. **バリデーションはValidator** - ozzo-validationで入力検証
3. **ユーザー分離** - 全クエリにuser_idを含める
4. **JWT認証** - Cookieベース、HttpOnly

### テスト方針

1. **バックエンドテスト優先** - データ処理のカバレッジを担保
2. **E2Eはハッピーパス** - 主要フローの動作確認
3. **トランザクションスコープDB** - go-txdbでテスト分離

---

## 次のアクション

**フェーズ1-6: フロントエンド認証UI** から開始

1. 共通コンポーネント作成（BaseButton, BaseFormInput等）
2. 認証Context・ミドルウェア作成
3. 会員登録ページ実装
4. ログインページ実装
5. ヘッダーナビゲーション実装

household-budgetのコードを参考にしながら、1ファイルずつ実装していきます。
