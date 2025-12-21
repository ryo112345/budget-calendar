import "@typespec/http";

using Http;

@doc("Create Budget Input")
model CreateBudgetInput {
  @doc("カテゴリID")
  category_id: int32;

  @doc("予算額")
  @minValue(1)
  amount: int32;

  @doc("対象月（YYYY-MM形式）")
  @maxLength(7)
  @minLength(7)
  month: string;
}

@doc("Update Budget Input (partial update)")
model UpdateBudgetInput {
  @doc("カテゴリID")
  category_id?: int32;

  @doc("予算額")
  @minValue(1)
  amount?: int32;

  @doc("対象月（YYYY-MM形式）")
  @maxLength(7)
  @minLength(7)
  month?: string;
}
