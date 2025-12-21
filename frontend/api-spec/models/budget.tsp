import "@typespec/http";
import "./category.tsp";

using Http;

@doc("Budget")
model Budget {
  @doc("予算ID")
  id: int32;

  @doc("ユーザーID")
  user_id: int32;

  @doc("カテゴリID")
  category_id: int32;

  @doc("カテゴリ情報")
  category: Category;

  @doc("予算額")
  amount: int32;

  @doc("対象月（YYYY-MM形式）")
  @maxLength(7)
  @minLength(7)
  month: string;

  @doc("作成日時")
  created_at: utcDateTime;

  @doc("更新日時")
  updated_at: utcDateTime;
}
