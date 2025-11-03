# budget-calendar 開発スケジュール

カレンダー形式で予算管理を行うアプリケーション

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

## フェーズ1: 基盤構築 (1-2週間)

### 1-1. プロジェクト初期設定 (1-2日)
- [ ] ディレクトリ構成作成
  - `frontend/`, `api-server/`, `migrations/`, `db/` の作成
  - `.gitignore`, `README.md` の準備
- [ ] Docker環境セットアップ
  - `docker-compose.yaml` 作成
  - MySQL コンテナ設定
  - API サーバーコンテナ設定（Dockerfile.dev, air設定）
  - フロントエンドコンテナ設定
- [ ] Git リポジトリ初期化
  - リポジトリ作成
  - 初回コミット

### 1-2. バックエンド基盤 (2-3日)
- [ ] Go プロジェクト初期化
  - `go mod init`
  - 依存パッケージインストール（Echo, GORM, oapi-codegen等）
  - ディレクトリ構造作成（`cmd/`, `internal/`, `api/`, `database/`）
  - 基本的なサーバー起動確認
- [ ] DB接続とマイグレーション環境
  - GORM DB接続設定
  - sql-migrate セットアップ
  - 初期マイグレーションファイル作成
- [ ] 環境変数管理
  - `.env`, `.env.sample`, `.env.test` 作成
  - godotenv 設定

### 1-3. 認証機能実装 (3-4日)
- [ ] ユーザーモデル作成
  - users テーブルマイグレーション
  - User モデル定義（GORM）
- [ ] 会員登録機能
  - パスワードハッシュ化（bcrypt）
  - バリデーション（ozzo-validation）
  - ユーザー作成API
  - テスト作成
- [ ] ログイン機能
  - JWT トークン発行
  - 認証ミドルウェア実装
  - ログインAPI
  - テスト作成

### 1-4. フロントエンド基盤 (2-3日)
- [ ] プロジェクトセットアップ
  - Vite + React + TypeScript 初期化
  - `pnpm init` & 依存パッケージインストール
  - React Router v7 設定
  - Tailwind CSS セットアップ
- [ ] 基本レイアウト
  - ルートレイアウト作成
  - ヘッダー/フッターコンポーネント
  - 共通スタイル設定
- [ ] 認証UI
  - 会員登録ページ (`/sign_up`)
  - ログインページ (`/sign_in`)
  - 認証Context作成
  - 認証ミドルウェア（クライアント側）

---

## フェーズ2: カレンダーコア機能 (2-3週間)

### 2-1. API設計 (2-3日)
- [ ] TypeSpec セットアップ
  - TypeSpec プロジェクト初期化
  - 基本型定義
- [ ] カレンダーデータ構造設計
  - イベント型定義（タイトル、日時、カテゴリ、金額等）
  - カテゴリ型定義
  - レスポンス型定義
- [ ] API仕様定義
  - `GET /events` - イベント一覧取得
  - `GET /events/:id` - イベント詳細取得
  - `POST /events` - イベント作成
  - `PUT /events/:id` - イベント更新
  - `DELETE /events/:id` - イベント削除
  - `GET /categories` - カテゴリ一覧取得
- [ ] OpenAPI生成確認
  - `tsp compile` で YAML 生成確認

### 2-2. バックエンド - データモデル実装 (2-3日)
- [ ] DBマイグレーション
  - events テーブル作成
  - categories テーブル作成
  - user_id との外部キー設定
- [ ] GORMモデル定義
  - Event モデル
  - Category モデル
  - アソシエーション設定
- [ ] バリデーションルール
  - イベント作成/更新時のバリデーション
  - 日付フォーマット検証
  - 必須項目チェック

### 2-3. バックエンド - イベントCRUD実装 (4-5日)
- [ ] oapi-codegen でコード生成
  - サーバースタブ生成
  - 型定義生成
- [ ] Service層実装
  - `EventService.List()` - フィルタリング、ページネーション
  - `EventService.Get()` - 単一イベント取得
  - `EventService.Create()` - バリデーション + DB保存
  - `EventService.Update()` - 権限チェック + 更新
  - `EventService.Delete()` - 論理削除 or 物理削除
- [ ] Handler層実装
  - リクエストパース
  - Service呼び出し
  - レスポンス返却
- [ ] テスト作成
  - factory-go でテストデータ生成
  - 各エンドポイントのテスト
  - エラーケーステスト

### 2-4. バックエンド - カテゴリ機能 (1-2日)
- [ ] カテゴリマスタデータ
  - 初期データマイグレーション（収入、支出、予定等）
- [ ] カテゴリAPI実装
  - `GET /categories` 実装
  - 必要に応じてカテゴリCRUD追加
- [ ] テスト作成

### 2-5. フロントエンド - API連携準備 (1-2日)
- [ ] Orval セットアップ
  - `orval.config.ts` 作成
  - custom-fetch.ts 実装（認証ヘッダー付与）
  - クライアントコード生成確認
- [ ] Tanstack Query セットアップ
  - QueryClient 設定
  - Provider設定
  - services配下のディレクトリ構成
- [ ] API Serviceファイル作成
  - `services/events.ts` - useEvents, useEvent等
  - `services/categories.ts` - useCategories

### 2-6. フロントエンド - カレンダーUI実装 (4-5日)
- [ ] FullCalendar統合
  - FullCalendar + React統合
  - 日本語ロケール設定
  - カスタムスタイリング（Tailwind）
- [ ] カレンダー表示機能
  - 月次カレンダービュー (`/calendar`)
  - イベントデータ取得（useEvents）
  - イベント表示（日付ごと）
  - ローディング/エラー表示
- [ ] イベント詳細表示
  - イベントクリック時のモーダル/詳細表示
  - カテゴリ別の色分け

### 2-7. フロントエンド - イベント作成/編集機能 (3-4日)
- [ ] イベント作成フォーム
  - モーダルコンポーネント作成
  - フォーム状態管理（useState）
  - 日付ピッカー実装
  - カテゴリ選択（ドロップダウン）
  - 金額入力
  - バリデーション（クライアント側）
- [ ] イベント作成処理
  - Tanstack Query Mutation
  - 楽観的UI更新
  - エラーハンドリング
- [ ] イベント編集機能
  - 編集フォーム（作成フォーム流用）
  - 既存データプリフィル
  - 更新処理
- [ ] イベント削除機能
  - 削除確認ダイアログ
  - 削除処理

### 2-8. フロントエンド - 日付ナビゲーション (1-2日)
- [ ] 月次切り替え
  - 前月/次月ボタン
  - 月選択ドロップダウン
  - URLパラメータと連動（`/calendar?month=2025-10`）
- [ ] 今日へジャンプボタン

---

## フェーズ3: 追加機能と改善 (1-2週間)

### 3-1. 月次集計機能 (2-3日)
- [ ] バックエンド
  - 月次集計API (`GET /monthly-summary`)
  - カテゴリ別集計
  - 収支合計計算
  - テスト作成
- [ ] フロントエンド
  - 集計表示コンポーネント
  - グラフ表示（Chart.js等、必要に応じて）
  - カレンダー上部に表示

### 3-2. フィルタリング/検索機能 (2-3日)
- [ ] バックエンド
  - クエリパラメータ対応（カテゴリ、期間、金額範囲）
  - 検索ロジック実装
- [ ] フロントエンド
  - フィルタUIコンポーネント
  - 検索フォーム
  - フィルタ適用後の表示更新

### 3-3. UI/UX改善 (2-3日)
- [ ] レスポンシブデザイン調整
  - モバイル対応
  - タブレット対応
- [ ] アクセシビリティ改善
  - キーボードナビゲーション
  - ARIA属性追加
- [ ] ローディング/エラー表示の統一
  - ErrorBoundary設定
  - Suspense活用
- [ ] アニメーション追加
  - ページ遷移
  - モーダル表示

---

## フェーズ4: テストとデプロイ (1-2週間)

### 4-1. E2Eテスト作成 (3-4日)
- [ ] Playwright セットアップ
  - `playwright.config.ts` 作成
  - テスト環境設定
- [ ] テストシナリオ作成
  - 会員登録 → ログイン → イベント作成 → 編集 → 削除
  - 月次切り替え
  - フィルタリング
  - 集計表示確認
- [ ] CI統合
  - GitHub Actions ワークフロー作成

### 4-2. バックエンドテスト拡充 (2-3日)
- [ ] カバレッジ確認
  - 既存テストのカバレッジ測定
  - 不足部分の追加
- [ ] 統合テスト
  - API統合テスト
  - DB連携テスト

### 4-3. CI/CD構築 (2-3日)
- [ ] GitHub Actions ワークフロー作成
  - `.github/workflows/api-lint-and-test.yml`
  - `.github/workflows/frontend-lint.yaml`
  - `.github/workflows/e2e.yaml`
  - `.github/workflows/build-and-deploy.yaml`
- [ ] Lint/Format チェック
- [ ] テスト自動実行
- [ ] codecov 統合

### 4-4. 本番環境準備 (2-3日)
- [ ] Cloud Run デプロイ設定
  - `cloudbuild.yaml` 作成
  - Artifact Registry 設定
  - 本番用Dockerfile作成
- [ ] TiDB セットアップ
  - TiDB Cloud設定
  - マイグレーション実行
- [ ] 環境変数管理
  - Secret Manager 設定
  - `.env.production` 管理
- [ ] 初回デプロイとテスト

---

## 合計見積もり: 5-8週間

### 各フェーズのマイルストーン
- **フェーズ1終了**: 認証機能付きの空アプリケーションが動作
- **フェーズ2終了**: カレンダーでイベントCRUDが完全動作
- **フェーズ3終了**: 集計・検索機能が動作
- **フェーズ4終了**: 本番環境で稼働開始

## 設計方針（household-budgetを踏襲）

### フロントエンド
- features に機能ごとの components と hooks を作成
- 可能な限りロジックは hooks に
- API クライアント関連はドメインごとに services 配下に作成
- コンポーネントは専属のものは features に、共通のものは root の components 配下に
- ページ遷移時の共通処理（認証チェック）はクライアントミドルウェアに

### バックエンド
- Handler → Service のレイヤードアーキテクチャ
- ロジックは Service に寄せる

### テスト方針
- データ周りや処理パターンの網羅性はバックエンド側のテストでカバレッジを担保
  - codecov でカバレッジの増減を可視化
- ハッピーパスのシステムテスト(E2E)で機能が仕様通りに動作することを担保
  - フロントエンド側のリファクタリングがしやすい
  - ライブラリのバージョンアップ時のリグレッションテストにもなる
