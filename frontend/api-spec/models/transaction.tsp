import "@typespec/http";
import "./category.tsp";

using Http;

@doc("Transaction")
model Transaction {
  @doc("取引ID")
  id: int32;

  @doc("ユーザーID")
  user_id: int32;

  @doc("カテゴリID")
  category_id: int32;

  @doc("カテゴリ情報")
  category: Category;

  @doc("金額")
  amount: int32;

  @doc("取引日")
  date: plainDate;

  @doc("説明")
  @maxLength(255)
  description: string;

  @doc("作成日時")
  created_at: utcDateTime;

  @doc("更新日時")
  updated_at: utcDateTime;
}
