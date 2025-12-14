package handlers

import (
	"context"
	"errors"

	api "apps/apis"
	"apps/internal/helpers"
	"apps/internal/services"

	"gorm.io/gorm"
)

type CategoriesHandler interface {
	// Get categories
	// (GET /categories)
	GetCategories(ctx context.Context, request api.GetCategoriesRequestObject) (api.GetCategoriesResponseObject, error)
	// Create category
	// (POST /categories)
	PostCategories(ctx context.Context, request api.PostCategoriesRequestObject) (api.PostCategoriesResponseObject, error)
	// Get category by ID
	// (GET /categories/{id})
	GetCategoriesId(ctx context.Context, request api.GetCategoriesIdRequestObject) (api.GetCategoriesIdResponseObject, error)
	// Update category
	// (PATCH /categories/{id})
	PatchCategoriesId(ctx context.Context, request api.PatchCategoriesIdRequestObject) (api.PatchCategoriesIdResponseObject, error)
	// Delete category
	// (DELETE /categories/{id})
	DeleteCategoriesId(ctx context.Context, request api.DeleteCategoriesIdRequestObject) (api.DeleteCategoriesIdResponseObject, error)
}

type categoriesHandler struct {
	service services.CategoryService
}

func NewCategoriesHandler(service services.CategoryService) CategoriesHandler {
	return &categoriesHandler{service: service}
}

// GetCategories implements api.StrictServerInterface
func (h *categoriesHandler) GetCategories(ctx context.Context, request api.GetCategoriesRequestObject) (api.GetCategoriesResponseObject, error) {
	userID, _ := helpers.ExtractUserID(ctx)

	categories, err := h.service.FetchCategoriesByUserID(userID)
	if err != nil {
		return api.GetCategories500JSONResponse{
			Error: api.ErrorResponse{
				Code:    500,
				Message: "サーバーエラーが発生しました",
				Status:  api.INTERNAL,
				Details: &[]api.ErrorInfo{
					{
						Type:   api.ErrorInfoTypeErrorInfo,
						Reason: api.DATABASEERROR,
						Domain: "budget-calendar.example.com",
					},
				},
			},
		}, nil
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

	return api.GetCategories200JSONResponse{
		Categories: apiCategories,
	}, nil
}

// PostCategories implements api.StrictServerInterface
func (h *categoriesHandler) PostCategories(ctx context.Context, request api.PostCategoriesRequestObject) (api.PostCategoriesResponseObject, error) {
	userID, _ := helpers.ExtractUserID(ctx)

	category, err := h.service.CreateCategory(userID, request.Body)
	if err != nil {
		// バリデーションエラーの場合
		metadata := helpers.ValidationErrorToMetadata(err)
		if len(metadata) > 0 {
			return api.PostCategories400JSONResponse{
				Error: api.ErrorResponse{
					Code:    400,
					Message: "入力値に誤りがあります",
					Status:  api.INVALIDARGUMENT,
					Details: &[]api.ErrorInfo{
						{
							Type:     api.ErrorInfoTypeErrorInfo,
							Reason:   api.INVALIDCATEGORYNAME,
							Domain:   "budget-calendar.example.com",
							Metadata: &metadata,
						},
					},
				},
			}, nil
		}

		return api.PostCategories500JSONResponse{
			Error: api.ErrorResponse{
				Code:    500,
				Message: "サーバーエラーが発生しました",
				Status:  api.INTERNAL,
				Details: &[]api.ErrorInfo{
					{
						Type:   api.ErrorInfoTypeErrorInfo,
						Reason: api.DATABASEERROR,
						Domain: "budget-calendar.example.com",
					},
				},
			},
		}, nil
	}

	return api.PostCategories201JSONResponse{
		Category: api.Category{
			Id:        int32(category.ID),
			UserId:    int32(category.UserID),
			Name:      category.Name,
			Color:     category.Color,
			CreatedAt: category.CreatedAt,
			UpdatedAt: category.UpdatedAt,
		},
	}, nil
}

// GetCategoriesId implements api.StrictServerInterface
func (h *categoriesHandler) GetCategoriesId(ctx context.Context, request api.GetCategoriesIdRequestObject) (api.GetCategoriesIdResponseObject, error) {
	userID, _ := helpers.ExtractUserID(ctx)

	category, err := h.service.FetchCategoryByID(uint(request.Id), userID)
	if err != nil {
		return api.GetCategoriesId404JSONResponse{
			Message: "カテゴリが見つかりません",
		}, nil
	}

	return api.GetCategoriesId200JSONResponse{
		Category: api.Category{
			Id:        int32(category.ID),
			UserId:    int32(category.UserID),
			Name:      category.Name,
			Color:     category.Color,
			CreatedAt: category.CreatedAt,
			UpdatedAt: category.UpdatedAt,
		},
	}, nil
}

// PatchCategoriesId implements api.StrictServerInterface
func (h *categoriesHandler) PatchCategoriesId(ctx context.Context, request api.PatchCategoriesIdRequestObject) (api.PatchCategoriesIdResponseObject, error) {
	userID, _ := helpers.ExtractUserID(ctx)

	category, err := h.service.UpdateCategory(uint(request.Id), userID, request.Body)
	if err != nil {
		// バリデーションエラーの場合
		metadata := helpers.ValidationErrorToMetadata(err)
		if len(metadata) > 0 {
			return api.PatchCategoriesId400JSONResponse{
				Error: api.ErrorResponse{
					Code:    400,
					Message: "入力値に誤りがあります",
					Status:  api.INVALIDARGUMENT,
					Details: &[]api.ErrorInfo{
						{
							Type:     api.ErrorInfoTypeErrorInfo,
							Reason:   api.INVALIDCATEGORYNAME,
							Domain:   "budget-calendar.example.com",
							Metadata: &metadata,
						},
					},
				},
			}, nil
		}

		// カテゴリが見つからない場合
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return api.PatchCategoriesId404JSONResponse{
				Message: "カテゴリが見つかりません",
			}, nil
		}

		// その他のエラー（データベースエラーなど）
		return api.PatchCategoriesId500JSONResponse{
			Error: api.ErrorResponse{
				Code:    500,
				Message: "サーバーエラーが発生しました",
				Status:  api.INTERNAL,
				Details: &[]api.ErrorInfo{
					{
						Type:   api.ErrorInfoTypeErrorInfo,
						Reason: api.DATABASEERROR,
						Domain: "budget-calendar.example.com",
					},
				},
			},
		}, nil
	}

	return api.PatchCategoriesId200JSONResponse{
		Category: api.Category{
			Id:        int32(category.ID),
			UserId:    int32(category.UserID),
			Name:      category.Name,
			Color:     category.Color,
			CreatedAt: category.CreatedAt,
			UpdatedAt: category.UpdatedAt,
		},
	}, nil
}

// DeleteCategoriesId implements api.StrictServerInterface
func (h *categoriesHandler) DeleteCategoriesId(ctx context.Context, request api.DeleteCategoriesIdRequestObject) (api.DeleteCategoriesIdResponseObject, error) {
	userID, _ := helpers.ExtractUserID(ctx)

	if err := h.service.DeleteCategory(uint(request.Id), userID); err != nil {
		// カテゴリが見つからない場合
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return api.DeleteCategoriesId404JSONResponse{
				Message: "カテゴリが見つかりません",
			}, nil
		}

		// その他のエラー（データベースエラーなど）
		return api.DeleteCategoriesId500JSONResponse{
			Error: api.ErrorResponse{
				Code:    500,
				Message: "サーバーエラーが発生しました",
				Status:  api.INTERNAL,
				Details: &[]api.ErrorInfo{
					{
						Type:   api.ErrorInfoTypeErrorInfo,
						Reason: api.DATABASEERROR,
						Domain: "budget-calendar.example.com",
					},
				},
			},
		}, nil
	}

	return api.DeleteCategoriesId204Response{}, nil
}

