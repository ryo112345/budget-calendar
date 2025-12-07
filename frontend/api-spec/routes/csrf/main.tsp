import "@typespec/http";
import "@typespec/openapi";
import "@typespec/openapi3";

import "./response.tsp";

import "../common";
import "../common/error.tsp";

using Http;
using OpenAPI;

@tag("csrf")
@route("/csrf")
namespace BudgetCalendarService.Csrf {
  interface Root {
    @operationId("get-csrf")
    @summary("Get Csrf")
    @doc("CSRFトークンを取得（認証不要）")
    @get
    get(): SuccessResponse<CsrfResponse>
      | ErrorInternalServerErrorResponse;
  }
}
