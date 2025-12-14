package handlers

import (
	api "apps/apis"
	"context"
)

type MainHandler struct {
	CsrfHandler
	UsersHandler
	CategoriesHandler
}

func NewMainHandler(csrfHandler CsrfHandler, usersHandler UsersHandler, categoriesHandler CategoriesHandler) *MainHandler {
	return &MainHandler{
		CsrfHandler:       csrfHandler,
		UsersHandler:      usersHandler,
		CategoriesHandler: categoriesHandler,
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
