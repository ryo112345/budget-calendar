import "@typespec/http";
import "@typespec/openapi";
import "@typespec/openapi3";

import "./request.tsp";
import "./response.tsp";

import "../common";
import "../common/error.tsp";

using Http;
using OpenAPI;

@tag("categories")
@route("/categories")
@useAuth([SecuritySchema])
namespace BudgetCalendarService.Category {
  interface Root {
    @operationId("get-categories")
    @summary("Get Categories")
    @doc("ユーザーに紐づくカテゴリ一覧を取得")
    @get
    get(): SuccessResponse<FetchCategoryListsResponse>
      | ErrorInternalServerErrorResponse;

    @operationId("post-categories")
    @summary("Create Category")
    @doc("新しいカテゴリを作成")
    @post
    post(
      @body body: CreateCategoryInput
    ): CreatedSuccessResponse<CreateCategoryResponse>
      | ErrorBadRequestResponse
      | ErrorInternalServerErrorResponse;
  }

  @route("/{id}")
  interface CategoryById {
    @operationId("get-categories-id")
    @summary("Get Category")
    @doc("カテゴリの詳細を取得")
    @get
    get(
      @path @doc("カテゴリID") id: int32
    ): SuccessResponse<FetchCategoryResponse>
      | ErrorBadRequestResponse
      | NotFoundErrorResponse
      | ErrorInternalServerErrorResponse;

    @operationId("patch-categories-id")
    @summary("Update Category")
    @doc("カテゴリを更新（部分更新）")
    @patch(#{implicitOptionality: true})
    patch(
      @path @doc("カテゴリID") id: int32,
      @body body: UpdateCategoryInput
    ): SuccessResponse<UpdateCategoryResponse>
      | ErrorBadRequestResponse
      | NotFoundErrorResponse
      | ErrorInternalServerErrorResponse;

    @operationId("delete-categories-id")
    @summary("Delete Category")
    @doc("カテゴリを削除")
    @delete
    delete(
      @path @doc("カテゴリID") id: int32
    ): NoContentSuccessResponse
      | NotFoundErrorResponse
      | ErrorInternalServerErrorResponse;
  }
}
