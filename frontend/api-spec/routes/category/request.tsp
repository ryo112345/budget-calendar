import "@typespec/http";
import "../../models/category.tsp";

using Http;

@doc("Create Category Input")
model CreateCategoryInput {
  @doc("カテゴリ名")
  @maxLength(100)
  name: string;

  @doc("カテゴリタイプ（収入/支出）")
  type: CategoryType;

  @doc("カテゴリの色")
  @maxLength(20)
  color: string;
}

@doc("Update Category Input (partial update)")
model UpdateCategoryInput {
  @doc("カテゴリ名")
  @maxLength(100)
  name?: string;

  @doc("カテゴリの色")
  @maxLength(20)
  color?: string;
}
