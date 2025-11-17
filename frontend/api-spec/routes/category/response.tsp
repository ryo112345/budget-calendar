import "../../models/category.tsp";

@doc("Fetch Category Lists Response")
model FetchCategoryListsResponse {
  categories: Category[];
}

@doc("Fetch Category Response")
model FetchCategoryResponse {
  category: Category;
}

@doc("Create Category Response")
model CreateCategoryResponse {
  category: Category;
}

@doc("Update Category Response")
model UpdateCategoryResponse {
  category: Category;
}
