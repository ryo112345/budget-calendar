namespace BudgetCalendarService.User;

@doc("User Sign Up Response")
model UserSignUpResponse {
  @doc("ステータスコード")
  code: int32;

  @doc("バリデーションエラー")
  errors: UserSignUpValidationError;
}

@doc("User Sign Up Validation Error")
model UserSignUpValidationError {
  @doc("ユーザー名のエラー")
  name?: string[];

  @doc("メールアドレスのエラー")
  email?: string[];

  @doc("パスワードのエラー")
  password?: string[];
}

@doc("User Sign In OK Response")
model UserSignInOkResponse {}

@doc("User CheckSignedIn Response")
model UserCheckSignedInResponse {
  @doc("ログイン状態")
  is_signed_in: boolean;
}
