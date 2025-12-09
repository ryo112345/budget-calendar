import "@typespec/http";

using Http;

namespace BudgetCalendarService.Models;

@doc("User")
model User {
  @doc("ユーザーID")
  id: int32;

  @doc("ユーザー名")
  name: string;

  @doc("メールアドレス")
  email: string;

  @doc("作成日時")
  created_at: utcDateTime;

  @doc("更新日時")
  updated_at: utcDateTime;
}
