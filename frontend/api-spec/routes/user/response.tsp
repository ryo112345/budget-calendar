namespace BudgetCalendarService.User;

@doc("User Sign Up Response")
model UserSignUpResponse {
  @doc("メッセージ")
  message: string;
}

@doc("User Sign In Response")
model UserSignInResponse {}

@doc("User CheckSignedIn Response")
model UserCheckSignedInResponse {
  @doc("ログイン状態")
  is_signed_in: boolean;
}
