import "@typespec/http";

using Http;

// カテゴリ固有のエラーレスポンス
model CategoryNotFoundErrorResponse {
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

model CreateCategoryBadRequestResponse {
  @statusCode status: 400;
  @body body: {
    errors: {
      name?: string[];
      color?: string[];
    };
  };
}

model UpdateCategoryBadRequestResponse {
  @statusCode status: 400;
  @body body: {
    errors: {
      name?: string[];
      color?: string[];
    };
  };
}
