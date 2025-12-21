package handlers

import (
	api "apps/apis"
	"context"
)

type MainHandler struct {
	CsrfHandler
	UsersHandler
	CategoriesHandler
	TransactionsHandler
	BudgetsHandler
}

func NewMainHandler(csrfHandler CsrfHandler, usersHandler UsersHandler, categoriesHandler CategoriesHandler, transactionsHandler TransactionsHandler, budgetsHandler BudgetsHandler) *MainHandler {
	return &MainHandler{
		CsrfHandler:         csrfHandler,
		UsersHandler:        usersHandler,
		CategoriesHandler:   categoriesHandler,
		TransactionsHandler: transactionsHandler,
		BudgetsHandler:      budgetsHandler,
	}
}

// Ensure MainHandler implements api.StrictServerInterface
var _ api.StrictServerInterface = (*MainHandler)(nil)

// CSRF
func (h *MainHandler) GetCsrf(ctx context.Context, request api.GetCsrfRequestObject) (api.GetCsrfResponseObject, error) {
	return h.CsrfHandler.GetCsrf(ctx, request)
}

// Users
func (h *MainHandler) PostUsersSignUp(ctx context.Context, request api.PostUsersSignUpRequestObject) (api.PostUsersSignUpResponseObject, error) {
	return h.UsersHandler.PostUsersSignUp(ctx, request)
}

func (h *MainHandler) PostUsersSignIn(ctx context.Context, request api.PostUsersSignInRequestObject) (api.PostUsersSignInResponseObject, error) {
	return h.UsersHandler.PostUsersSignIn(ctx, request)
}

func (h *MainHandler) GetUsersCheckSignedIn(ctx context.Context, request api.GetUsersCheckSignedInRequestObject) (api.GetUsersCheckSignedInResponseObject, error) {
	return h.UsersHandler.GetUsersCheckSignedIn(ctx, request)
}

// Categories
func (h *MainHandler) GetCategories(ctx context.Context, request api.GetCategoriesRequestObject) (api.GetCategoriesResponseObject, error) {
	return h.CategoriesHandler.GetCategories(ctx, request)
}

func (h *MainHandler) PostCategories(ctx context.Context, request api.PostCategoriesRequestObject) (api.PostCategoriesResponseObject, error) {
	return h.CategoriesHandler.PostCategories(ctx, request)
}

func (h *MainHandler) GetCategoriesId(ctx context.Context, request api.GetCategoriesIdRequestObject) (api.GetCategoriesIdResponseObject, error) {
	return h.CategoriesHandler.GetCategoriesId(ctx, request)
}

func (h *MainHandler) PatchCategoriesId(ctx context.Context, request api.PatchCategoriesIdRequestObject) (api.PatchCategoriesIdResponseObject, error) {
	return h.CategoriesHandler.PatchCategoriesId(ctx, request)
}

func (h *MainHandler) DeleteCategoriesId(ctx context.Context, request api.DeleteCategoriesIdRequestObject) (api.DeleteCategoriesIdResponseObject, error) {
	return h.CategoriesHandler.DeleteCategoriesId(ctx, request)
}

// Transactions
func (h *MainHandler) GetTransactions(ctx context.Context, request api.GetTransactionsRequestObject) (api.GetTransactionsResponseObject, error) {
	return h.TransactionsHandler.GetTransactions(ctx, request)
}

func (h *MainHandler) PostTransactions(ctx context.Context, request api.PostTransactionsRequestObject) (api.PostTransactionsResponseObject, error) {
	return h.TransactionsHandler.PostTransactions(ctx, request)
}

func (h *MainHandler) GetTransactionsId(ctx context.Context, request api.GetTransactionsIdRequestObject) (api.GetTransactionsIdResponseObject, error) {
	return h.TransactionsHandler.GetTransactionsId(ctx, request)
}

func (h *MainHandler) PatchTransactionsId(ctx context.Context, request api.PatchTransactionsIdRequestObject) (api.PatchTransactionsIdResponseObject, error) {
	return h.TransactionsHandler.PatchTransactionsId(ctx, request)
}

func (h *MainHandler) DeleteTransactionsId(ctx context.Context, request api.DeleteTransactionsIdRequestObject) (api.DeleteTransactionsIdResponseObject, error) {
	return h.TransactionsHandler.DeleteTransactionsId(ctx, request)
}

// Budgets
func (h *MainHandler) GetBudgets(ctx context.Context, request api.GetBudgetsRequestObject) (api.GetBudgetsResponseObject, error) {
	return h.BudgetsHandler.GetBudgets(ctx, request)
}

func (h *MainHandler) PostBudgets(ctx context.Context, request api.PostBudgetsRequestObject) (api.PostBudgetsResponseObject, error) {
	return h.BudgetsHandler.PostBudgets(ctx, request)
}

func (h *MainHandler) GetBudgetsId(ctx context.Context, request api.GetBudgetsIdRequestObject) (api.GetBudgetsIdResponseObject, error) {
	return h.BudgetsHandler.GetBudgetsId(ctx, request)
}

func (h *MainHandler) PatchBudgetsId(ctx context.Context, request api.PatchBudgetsIdRequestObject) (api.PatchBudgetsIdResponseObject, error) {
	return h.BudgetsHandler.PatchBudgetsId(ctx, request)
}

func (h *MainHandler) DeleteBudgetsId(ctx context.Context, request api.DeleteBudgetsIdRequestObject) (api.DeleteBudgetsIdResponseObject, error) {
	return h.BudgetsHandler.DeleteBudgetsId(ctx, request)
}
