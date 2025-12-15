import "../../models/transaction.tsp";

@doc("Fetch Transaction List Response")
model FetchTransactionListResponse {
  transactions: Transaction[];
}

@doc("Fetch Transaction Response")
model FetchTransactionResponse {
  transaction: Transaction;
}

@doc("Create Transaction Response")
model CreateTransactionResponse {
  transaction: Transaction;
}

@doc("Update Transaction Response")
model UpdateTransactionResponse {
  transaction: Transaction;
}
