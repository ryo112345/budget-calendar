import "@typespec/http";
import "../../models/transaction.tsp";

using Http;

@doc("Create Transaction Input")
model CreateTransactionInput {
  @doc("カテゴリID")
  category_id: int32;

  @doc("取引タイプ（収入/支出）")
  type: TransactionType;

  @doc("金額")
  @minValue(1)
  amount: int32;

  @doc("取引日")
  date: plainDate;

  @doc("説明")
  @maxLength(255)
  description?: string;
}

@doc("Update Transaction Input (partial update)")
model UpdateTransactionInput {
  @doc("カテゴリID")
  category_id?: int32;

  @doc("取引タイプ（収入/支出）")
  type?: TransactionType;

  @doc("金額")
  @minValue(1)
  amount?: int32;

  @doc("取引日")
  date?: plainDate;

  @doc("説明")
  @maxLength(255)
  description?: string;
}
