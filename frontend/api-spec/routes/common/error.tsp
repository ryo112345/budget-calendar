import "@typespec/http";

using Http;

// RFC 7807 Problem Details for HTTP APIs
model ProblemDetail {
  @doc("エラータイプを識別するURI")
  type: string;

  @doc("人間が読める短いエラータイトル")
  title: string;

  @doc("HTTPステータスコード")
  status: int32;

  @doc("詳細なエラーメッセージ")
  detail: string;

  @doc("問題が発生したリクエストのURI")
  instance?: string;
}

// 共通エラーレスポンス (RFC 7807準拠)
model BadRequestWithCodeResponse {
  @statusCode status: 400;
  @header contentType: "application/problem+json";
  @body body: ProblemDetail;
}

model InternalServerErrorWithCodeResponse {
  @statusCode status: 500;
  @header contentType: "application/problem+json";
  @body body: ProblemDetail;
}
