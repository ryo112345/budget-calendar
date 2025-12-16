import "@typespec/http";
import "@typespec/openapi";
import "@typespec/openapi3";

import "./request.tsp";
import "./response.tsp";

import "../common";
import "../common/error.tsp";

using Http;
using OpenAPI;

@tag("transactions")
@route("/transactions")
@useAuth([SecuritySchema])
namespace BudgetCalendarService.Transaction {
  interface Root {
    @operationId("get-transactions")
    @summary("Get Transactions")
    @doc("ユーザーに紐づく取引一覧を取得。クエリパラメータでフィルタリング可能")
    @get
    get(
      @query @doc("開始日（YYYY-MM-DD形式）") start_date?: plainDate,
      @query @doc("終了日（YYYY-MM-DD形式）") end_date?: plainDate,
      @query @doc("取引タイプ（income/expense）") type?: TransactionType,
      @query @doc("カテゴリID") category_id?: int32
    ): SuccessResponse<FetchTransactionListResponse>
      | ErrorBadRequestResponse
      | ErrorInternalServerErrorResponse;

    @operationId("post-transactions")
    @summary("Create Transaction")
    @doc("新しい取引を作成")
    @post
    post(
      @body body: CreateTransactionInput
    ): CreatedSuccessResponse<CreateTransactionResponse>
      | ErrorBadRequestResponse
      | ErrorInternalServerErrorResponse;
  }

  @route("/{id}")
  interface TransactionById {
    @operationId("get-transactions-id")
    @summary("Get Transaction")
    @doc("取引の詳細を取得")
    @get
    get(
      @path @doc("取引ID") id: int32
    ): SuccessResponse<FetchTransactionResponse>
      | ErrorBadRequestResponse
      | NotFoundErrorResponse
      | ErrorInternalServerErrorResponse;

    @operationId("patch-transactions-id")
    @summary("Update Transaction")
    @doc("取引を更新（部分更新）")
    @patch(#{implicitOptionality: true})
    patch(
      @path @doc("取引ID") id: int32,
      @body body: UpdateTransactionInput
    ): SuccessResponse<UpdateTransactionResponse>
      | ErrorBadRequestResponse
      | NotFoundErrorResponse
      | ErrorInternalServerErrorResponse;

    @operationId("delete-transactions-id")
    @summary("Delete Transaction")
    @doc("取引を削除")
    @delete
    delete(
      @path @doc("取引ID") id: int32
    ): NoContentSuccessResponse
      | NotFoundErrorResponse
      | ErrorInternalServerErrorResponse;
  }
}
