namespace BudgetCalendarService.User;

@doc("Sign Up Input")
model SignUpInput {
  @doc("ユーザー名")
  name: string;

  @doc("メールアドレス")
  email: string;

  @doc("パスワード")
  password: string;
}

@doc("Sign In Input")
model SignInInput {
  @doc("メールアドレス")
  email: string;

  @doc("パスワード")
  password: string;
}
