import "@typespec/http";

using Http;

// Transaction固有のエラーレスポンス（必要に応じて追加）
model TransactionNotFoundErrorResponse {
  @statusCode status: 404;
  @body body: {
    error: {
      @doc("エラーコード")
      code: string;

      @doc("エラーメッセージ")
      message: string;
    };
  };
}
