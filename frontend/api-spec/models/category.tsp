import "@typespec/http";

using Http;

@doc("Category")
model Category {
  @doc("カテゴリID")
  id: int32;

  @doc("ユーザーID")
  user_id: int32;

  @doc("カテゴリ名")
  @maxLength(100)
  name: string;

  @doc("カテゴリの色")
  @maxLength(20)
  color: string;

  @doc("作成日時")
  created_at: utcDateTime;

  @doc("更新日時")
  updated_at: utcDateTime;
}
