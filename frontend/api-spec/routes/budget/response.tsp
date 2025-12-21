import "../../models/budget.tsp";

@doc("Fetch Budget List Response")
model FetchBudgetListResponse {
  budgets: Budget[];
}

@doc("Fetch Budget Response")
model FetchBudgetResponse {
  budget: Budget;
}

@doc("Create Budget Response")
model CreateBudgetResponse {
  budget: Budget;
}

@doc("Update Budget Response")
model UpdateBudgetResponse {
  budget: Budget;
}
