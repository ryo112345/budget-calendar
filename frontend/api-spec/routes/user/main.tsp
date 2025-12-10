import "@typespec/http";
import "@typespec/openapi";
import "@typespec/openapi3";

import "./request.tsp";
import "./response.tsp";
import "./error.tsp";

import "../common";
import "../common/error.tsp";

using Http;
using OpenAPI;

@tag("users")
@route("/users")
namespace BudgetCalendarService.User {
  @route("/signUp")
  interface SignUp {
    @operationId("post-users-sign-up")
    @summary("User SignUp")
    @doc("ユーザー登録")
    @post
    post(
      @body body: SignUpInput
    ): SuccessResponse<UserSignUpResponse>
      | ErrorBadRequestResponse
      | ErrorConflictResponse
      | ErrorInternalServerErrorResponse;
  }

  @route("/signIn")
  interface SignIn {
    @operationId("post-users-sign-in")
    @summary("User SignIn")
    @doc("ユーザーログイン")
    @post
    post(
      @body body: SignInInput
    ): {
      @statusCode status: 200;
      @header setCookie?: string;
      @body body: UserSignInResponse;
    }
      | ErrorBadRequestResponse
      | ErrorUnauthorizedResponse
      | ErrorInternalServerErrorResponse;
  }

  @route("/checkSignedIn")
  interface CheckSignedIn {
    @useAuth([SecuritySchema])
    @operationId("get-users-check-signed-in")
    @summary("User CheckSignedIn")
    @doc("ログイン状態確認")
    @get
    get(): SuccessResponse<UserCheckSignedInResponse>;
  }
}
