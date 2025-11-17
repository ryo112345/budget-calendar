import "@typespec/http";

using Http;

// 共通エラーレスポンス
model BadRequestWithCodeResponse {
  @statusCode status: 400;
  @body body: {
    error: {
      @doc("エラーコード")
      code: string;

      @doc("エラーメッセージ")
      message: string;
    };
  };
}

model InternalServerErrorWithCodeResponse {
  @statusCode status: 500;
  @body body: {
    error: {
      @doc("エラーコード")
      code: string;

      @doc("エラーメッセージ")
      message: string;
    };
  };
}
