namespace BudgetCalendarService.User;

@doc("Sign In Bad Request")
model SignInBadRequestResponse {
  @doc("エラーメッセージ")
  errors: string[];
}
