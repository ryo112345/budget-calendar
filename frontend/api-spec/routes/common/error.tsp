import "@typespec/http";

using Http;

@doc("標準エラーステータス（Google API Standard準拠）")
enum ErrorStatus {
  @doc("無効な引数")
  INVALID_ARGUMENT: "INVALID_ARGUMENT",

  @doc("リソースが既に存在")
  ALREADY_EXISTS: "ALREADY_EXISTS",

  @doc("リソースが見つからない")
  NOT_FOUND: "NOT_FOUND",

  @doc("権限不足")
  PERMISSION_DENIED: "PERMISSION_DENIED",

  @doc("認証されていない")
  UNAUTHENTICATED: "UNAUTHENTICATED",

  @doc("内部エラー")
  INTERNAL: "INTERNAL",
}

@doc("エラー理由の定数")
enum ErrorReason {
  // User関連
  @doc("メールアドレスが既に登録されている - 推奨メッセージ: このメールアドレスは既に登録されています")
  EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",

  @doc("無効なメールアドレス形式 - 推奨メッセージ: メールアドレスの形式が正しくありません")
  INVALID_EMAIL: "INVALID_EMAIL",

  @doc("無効なパスワード - 推奨メッセージ: パスワードは8文字以上で入力してください")
  INVALID_PASSWORD: "INVALID_PASSWORD",

  @doc("ユーザーが見つからない - 推奨メッセージ: ユーザーが見つかりません")
  USER_NOT_FOUND: "USER_NOT_FOUND",

  @doc("認証情報が不正 - 推奨メッセージ: メールアドレスまたはパスワードが正しくありません")
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",

  // Category関連
  @doc("カテゴリが見つからない - 推奨メッセージ: カテゴリが見つかりません")
  CATEGORY_NOT_FOUND: "CATEGORY_NOT_FOUND",

  @doc("無効なカテゴリ名 - 推奨メッセージ: カテゴリ名を正しく入力してください")
  INVALID_CATEGORY_NAME: "INVALID_CATEGORY_NAME",

  @doc("無効なカテゴリ色 - 推奨メッセージ: カラーコードを正しく入力してください")
  INVALID_CATEGORY_COLOR: "INVALID_CATEGORY_COLOR",

  // その他
  @doc("データベースエラー - 推奨メッセージ: サーバーエラーが発生しました")
  DATABASE_ERROR: "DATABASE_ERROR",

  @doc("不明なエラー - 推奨メッセージ: 予期しないエラーが発生しました")
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
}

@doc("エラー詳細情報")
model ErrorInfo {
  @doc("型識別子")
  `@type`: "ErrorInfo";

  @doc("エラーの理由")
  reason: ErrorReason;

  @doc("エラーが発生したドメイン")
  domain: string;

  @doc("追加のメタデータ（キー・バリュー）")
  metadata?: Record<string>;
}

@doc("エラーレスポンス")
model ErrorResponse {
  @doc("HTTPステータスコード")
  code: int32;

  @doc("人間が読めるエラーメッセージ")
  message: string;

  @doc("標準エラーステータス")
  status: ErrorStatus;

  @doc("詳細なエラー情報")
  details?: ErrorInfo[];
}

@doc("エラーレスポンスボディ")
model ErrorBody {
  error: ErrorResponse;
}

// 共通エラーレスポンス
@doc("400 Bad Request - バリデーションエラー (例: INVALID_EMAIL, INVALID_PASSWORD)")
model ErrorBadRequestResponse {
  @statusCode status: 400;
  @header contentType: "application/json";
  @body body: ErrorBody;
}

@doc("401 Unauthorized - 認証エラー (例: INVALID_CREDENTIALS)")
model ErrorUnauthorizedResponse {
  @statusCode status: 401;
  @header contentType: "application/json";
  @body body: ErrorBody;
}

@doc("403 Forbidden - 権限エラー (例: PERMISSION_DENIED)")
model ErrorForbiddenResponse {
  @statusCode status: 403;
  @header contentType: "application/json";
  @body body: ErrorBody;
}

@doc("409 Conflict - リソース競合エラー (例: EMAIL_ALREADY_EXISTS)")
model ErrorConflictResponse {
  @statusCode status: 409;
  @header contentType: "application/json";
  @body body: ErrorBody;
}

@doc("500 Internal Server Error - サーバーエラー (例: DATABASE_ERROR, UNKNOWN_ERROR)")
model ErrorInternalServerErrorResponse {
  @statusCode status: 500;
  @header contentType: "application/json";
  @body body: ErrorBody;
}
