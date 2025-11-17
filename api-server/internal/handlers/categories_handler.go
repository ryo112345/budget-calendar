package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
	api "github.com/yamao/budget-calendar/apis"
	"github.com/yamao/budget-calendar/internal/services"
)

type CategoriesHandler struct {
	service services.CategoryService
}

func NewCategoriesHandler(service services.CategoryService) *CategoriesHandler {
	return &CategoriesHandler{service: service}
}

// GetCategories implements api.ServerInterface
func (h *CategoriesHandler) GetCategories(ctx echo.Context) error {
	userID := uint(1) // TODO: 認証から取得

	categories, err := h.service.FetchCategoriesByUserID(userID)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]interface{}{
			"error": map[string]string{
				"code":    "INTERNAL_SERVER_ERROR",
				"message": "サーバーエラーが発生しました",
			},
		})
	}

	apiCategories := make([]api.Category, len(categories))
	for i, cat := range categories {
		apiCategories[i] = api.Category{
			Id:        int32(cat.ID),
			UserId:    int32(cat.UserID),
			Name:      cat.Name,
			Color:     cat.Color,
			CreatedAt: cat.CreatedAt,
			UpdatedAt: cat.UpdatedAt,
		}
	}

	return ctx.JSON(http.StatusOK, api.FetchCategoryListsResponse{
		Categories: apiCategories,
	})
}

// PostCategories implements api.ServerInterface
func (h *CategoriesHandler) PostCategories(ctx echo.Context) error {
	userID := uint(1) // TODO: 認証から取得

	var req api.CreateCategoryInput
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"errors": map[string][]string{},
		})
	}

	category, err := h.service.CreateCategory(userID, &req)
	if err != nil {
		// バリデーションエラーの場合
		validationErrors := h.service.MapValidationErrors(err)
		if len(validationErrors) > 0 {
			return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
				"errors": validationErrors,
			})
		}

		return ctx.JSON(http.StatusInternalServerError, map[string]interface{}{
			"error": map[string]string{
				"code":    "INTERNAL_SERVER_ERROR",
				"message": "サーバーエラーが発生しました",
			},
		})
	}

	return ctx.JSON(http.StatusCreated, api.CreateCategoryResponse{
		Category: api.Category{
			Id:        int32(category.ID),
			UserId:    int32(category.UserID),
			Name:      category.Name,
			Color:     category.Color,
			CreatedAt: category.CreatedAt,
			UpdatedAt: category.UpdatedAt,
		},
	})
}

// GetCategoriesId implements api.ServerInterface
func (h *CategoriesHandler) GetCategoriesId(ctx echo.Context, id int32) error {
	userID := uint(1) // TODO: 認証から取得

	category, err := h.service.FetchCategoryByID(uint(id), userID)
	if err != nil {
		return ctx.JSON(http.StatusNotFound, map[string]interface{}{
			"error": map[string]string{
				"code":    "CATEGORY_NOT_FOUND",
				"message": "カテゴリが見つかりません",
			},
		})
	}

	return ctx.JSON(http.StatusOK, api.FetchCategoryResponse{
		Category: api.Category{
			Id:        int32(category.ID),
			UserId:    int32(category.UserID),
			Name:      category.Name,
			Color:     category.Color,
			CreatedAt: category.CreatedAt,
			UpdatedAt: category.UpdatedAt,
		},
	})
}

// PatchCategoriesId implements api.ServerInterface
func (h *CategoriesHandler) PatchCategoriesId(ctx echo.Context, id int32) error {
	userID := uint(1) // TODO: 認証から取得

	var req api.UpdateCategoryInput
	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
			"errors": map[string][]string{},
		})
	}

	category, err := h.service.UpdateCategory(uint(id), userID, &req)
	if err != nil {
		// バリデーションエラーの場合
		validationErrors := h.service.MapValidationErrors(err)
		if len(validationErrors) > 0 {
			return ctx.JSON(http.StatusBadRequest, map[string]interface{}{
				"errors": validationErrors,
			})
		}

		return ctx.JSON(http.StatusNotFound, map[string]interface{}{
			"error": map[string]string{
				"code":    "CATEGORY_NOT_FOUND",
				"message": "カテゴリが見つかりません",
			},
		})
	}

	return ctx.JSON(http.StatusOK, api.UpdateCategoryResponse{
		Category: api.Category{
			Id:        int32(category.ID),
			UserId:    int32(category.UserID),
			Name:      category.Name,
			Color:     category.Color,
			CreatedAt: category.CreatedAt,
			UpdatedAt: category.UpdatedAt,
		},
	})
}

// DeleteCategoriesId implements api.ServerInterface
func (h *CategoriesHandler) DeleteCategoriesId(ctx echo.Context, id int32) error {
	userID := uint(1) // TODO: 認証から取得

	if err := h.service.DeleteCategory(uint(id), userID); err != nil {
		return ctx.JSON(http.StatusNotFound, map[string]interface{}{
			"error": map[string]string{
				"code":    "CATEGORY_NOT_FOUND",
				"message": "カテゴリが見つかりません",
			},
		})
	}

	return ctx.NoContent(http.StatusNoContent)
}
