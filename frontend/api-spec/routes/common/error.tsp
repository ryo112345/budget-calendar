import "@typespec/http";

using Http;

@doc("エラー詳細情報")
model ErrorInfo {
  @doc("型識別子")
  `@type`: "ErrorInfo";

  @doc("エラーの理由（SHORT_SNAKE_CASE形式）")
  reason: string;

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

  @doc("標準エラーステータス（INVALID_ARGUMENT, ALREADY_EXISTSなど）")
  status: string;

  @doc("詳細なエラー情報")
  details?: ErrorInfo[];
}

@doc("エラーレスポンスボディ")
model ErrorBody {
  error: ErrorResponse;
}

// 共通エラーレスポンス
model ErrorBadRequestResponse {
  @statusCode status: 400;
  @header contentType: "application/json";
  @body body: ErrorBody;
}

model ErrorUnauthorizedResponse {
  @statusCode status: 401;
  @header contentType: "application/json";
  @body body: ErrorBody;
}

model ErrorForbiddenResponse {
  @statusCode status: 403;
  @header contentType: "application/json";
  @body body: ErrorBody;
}

model ErrorConflictResponse {
  @statusCode status: 409;
  @header contentType: "application/json";
  @body body: ErrorBody;
}

model ErrorInternalServerErrorResponse {
  @statusCode status: 500;
  @header contentType: "application/json";
  @body body: ErrorBody;
}
