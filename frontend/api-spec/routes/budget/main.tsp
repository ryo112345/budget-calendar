import "@typespec/http";
import "@typespec/openapi";
import "@typespec/openapi3";

import "./request.tsp";
import "./response.tsp";

import "../common";
import "../common/error.tsp";

using Http;
using OpenAPI;

@tag("budgets")
@route("/budgets")
@useAuth([SecuritySchema])
namespace BudgetCalendarService.Budget {
  interface Root {
    @operationId("get-budgets")
    @summary("Get Budgets")
    @doc("ユーザーに紐づく予算一覧を取得。クエリパラメータでフィルタリング可能")
    @get
    get(
      @query @doc("対象月（YYYY-MM形式）") month?: string,
      @query @doc("カテゴリID") category_id?: int32
    ): SuccessResponse<FetchBudgetListResponse>
      | ErrorBadRequestResponse
      | ErrorInternalServerErrorResponse;

    @operationId("post-budgets")
    @summary("Create Budget")
    @doc("新しい予算を作成")
    @post
    post(
      @body body: CreateBudgetInput
    ): CreatedSuccessResponse<CreateBudgetResponse>
      | ErrorBadRequestResponse
      | ErrorConflictResponse
      | ErrorInternalServerErrorResponse;
  }

  @route("/{id}")
  interface BudgetById {
    @operationId("get-budgets-id")
    @summary("Get Budget")
    @doc("予算の詳細を取得")
    @get
    get(
      @path @doc("予算ID") id: int32
    ): SuccessResponse<FetchBudgetResponse>
      | ErrorBadRequestResponse
      | NotFoundErrorResponse
      | ErrorInternalServerErrorResponse;

    @operationId("patch-budgets-id")
    @summary("Update Budget")
    @doc("予算を更新（部分更新）")
    @patch(#{implicitOptionality: true})
    patch(
      @path @doc("予算ID") id: int32,
      @body body: UpdateBudgetInput
    ): SuccessResponse<UpdateBudgetResponse>
      | ErrorBadRequestResponse
      | NotFoundErrorResponse
      | ErrorConflictResponse
      | ErrorInternalServerErrorResponse;

    @operationId("delete-budgets-id")
    @summary("Delete Budget")
    @doc("予算を削除")
    @delete
    delete(
      @path @doc("予算ID") id: int32
    ): NoContentSuccessResponse
      | NotFoundErrorResponse
      | ErrorInternalServerErrorResponse;
  }
}
