package handlers

import (
	"context"
	"errors"

	api "apps/apis"
	"apps/internal/helpers"
	"apps/internal/models"
	"apps/internal/services"

	"gorm.io/gorm"
)

type BudgetsHandler interface {
	// Get budgets
	// (GET /budgets)
	GetBudgets(ctx context.Context, request api.GetBudgetsRequestObject) (api.GetBudgetsResponseObject, error)
	// Create budget
	// (POST /budgets)
	PostBudgets(ctx context.Context, request api.PostBudgetsRequestObject) (api.PostBudgetsResponseObject, error)
	// Get budget by ID
	// (GET /budgets/{id})
	GetBudgetsId(ctx context.Context, request api.GetBudgetsIdRequestObject) (api.GetBudgetsIdResponseObject, error)
	// Update budget
	// (PATCH /budgets/{id})
	PatchBudgetsId(ctx context.Context, request api.PatchBudgetsIdRequestObject) (api.PatchBudgetsIdResponseObject, error)
	// Delete budget
	// (DELETE /budgets/{id})
	DeleteBudgetsId(ctx context.Context, request api.DeleteBudgetsIdRequestObject) (api.DeleteBudgetsIdResponseObject, error)
}

type budgetsHandler struct {
	service services.BudgetService
}

func NewBudgetsHandler(service services.BudgetService) BudgetsHandler {
	return &budgetsHandler{service: service}
}

// GetBudgets implements api.StrictServerInterface
func (h *budgetsHandler) GetBudgets(ctx context.Context, request api.GetBudgetsRequestObject) (api.GetBudgetsResponseObject, error) {
	userID, _ := helpers.ExtractUserID(ctx)

	budgets, err := h.service.FetchBudgets(userID, &request.Params)
	if err != nil {
		return api.GetBudgets500JSONResponse{
			Error: api.ErrorResponse{
				Code:    500,
				Message: "エラーが発生しました",
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

	apiBudgets := make([]api.Budget, len(budgets))
	for i, b := range budgets {
		apiBudgets[i] = toAPIBudget(&b)
	}

	return api.GetBudgets200JSONResponse{
		Budgets: apiBudgets,
	}, nil
}

// PostBudgets implements api.StrictServerInterface
func (h *budgetsHandler) PostBudgets(ctx context.Context, request api.PostBudgetsRequestObject) (api.PostBudgetsResponseObject, error) {
	userID, _ := helpers.ExtractUserID(ctx)

	budget, err := h.service.CreateBudget(userID, request.Body)
	if err != nil {
		// バリデーションエラーの場合
		metadata := helpers.ValidationErrorToMetadata(err)
		if len(metadata) > 0 {
			return api.PostBudgets400JSONResponse{
				Error: api.ErrorResponse{
					Code:    400,
					Message: "入力内容に誤りがあります",
					Status:  api.INVALIDARGUMENT,
					Details: &[]api.ErrorInfo{
						{
							Type:     api.ErrorInfoTypeErrorInfo,
							Reason:   api.INVALIDBUDGETAMOUNT,
							Domain:   "budget-calendar.example.com",
							Metadata: &metadata,
						},
					},
				},
			}, nil
		}

		// カテゴリが見つからない場合
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return api.PostBudgets400JSONResponse{
				Error: api.ErrorResponse{
					Code:    400,
					Message: "指定されたカテゴリが見つかりません",
					Status:  api.INVALIDARGUMENT,
					Details: &[]api.ErrorInfo{
						{
							Type:   api.ErrorInfoTypeErrorInfo,
							Reason: api.CATEGORYNOTFOUND,
							Domain: "budget-calendar.example.com",
						},
					},
				},
			}, nil
		}

		// 予算が既に存在する場合
		if errors.Is(err, services.ErrBudgetAlreadyExists) {
			return api.PostBudgets409JSONResponse{
				Error: api.ErrorResponse{
					Code:    409,
					Message: "この月のこのカテゴリの予算は既に存在します",
					Status:  api.ALREADYEXISTS,
					Details: &[]api.ErrorInfo{
						{
							Type:   api.ErrorInfoTypeErrorInfo,
							Reason: api.BUDGETALREADYEXISTS,
							Domain: "budget-calendar.example.com",
						},
					},
				},
			}, nil
		}

		return api.PostBudgets500JSONResponse{
			Error: api.ErrorResponse{
				Code:    500,
				Message: "エラーが発生しました",
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

	return api.PostBudgets201JSONResponse{
		Budget: toAPIBudget(budget),
	}, nil
}

// GetBudgetsId implements api.StrictServerInterface
func (h *budgetsHandler) GetBudgetsId(ctx context.Context, request api.GetBudgetsIdRequestObject) (api.GetBudgetsIdResponseObject, error) {
	userID, _ := helpers.ExtractUserID(ctx)

	budget, err := h.service.FetchBudgetByID(uint(request.Id), userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return api.GetBudgetsId404JSONResponse{
				Error: api.ErrorResponse{
					Code:    404,
					Message: "予算が見つかりません",
					Status:  api.NOTFOUND,
					Details: &[]api.ErrorInfo{
						{
							Type:   api.ErrorInfoTypeErrorInfo,
							Reason: api.BUDGETNOTFOUND,
							Domain: "budget-calendar.example.com",
						},
					},
				},
			}, nil
		}

		return api.GetBudgetsId500JSONResponse{
			Error: api.ErrorResponse{
				Code:    500,
				Message: "エラーが発生しました",
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

	return api.GetBudgetsId200JSONResponse{
		Budget: toAPIBudget(budget),
	}, nil
}

// PatchBudgetsId implements api.StrictServerInterface
func (h *budgetsHandler) PatchBudgetsId(ctx context.Context, request api.PatchBudgetsIdRequestObject) (api.PatchBudgetsIdResponseObject, error) {
	userID, _ := helpers.ExtractUserID(ctx)

	budget, err := h.service.UpdateBudget(uint(request.Id), userID, request.Body)
	if err != nil {
		// バリデーションエラーの場合
		metadata := helpers.ValidationErrorToMetadata(err)
		if len(metadata) > 0 {
			return api.PatchBudgetsId400JSONResponse{
				Error: api.ErrorResponse{
					Code:    400,
					Message: "入力内容に誤りがあります",
					Status:  api.INVALIDARGUMENT,
					Details: &[]api.ErrorInfo{
						{
							Type:     api.ErrorInfoTypeErrorInfo,
							Reason:   api.INVALIDBUDGETAMOUNT,
							Domain:   "budget-calendar.example.com",
							Metadata: &metadata,
						},
					},
				},
			}, nil
		}

		// 予算またはカテゴリが見つからない場合
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return api.PatchBudgetsId404JSONResponse{
				Error: api.ErrorResponse{
					Code:    404,
					Message: "予算が見つかりません",
					Status:  api.NOTFOUND,
					Details: &[]api.ErrorInfo{
						{
							Type:   api.ErrorInfoTypeErrorInfo,
							Reason: api.BUDGETNOTFOUND,
							Domain: "budget-calendar.example.com",
						},
					},
				},
			}, nil
		}

		// 予算が既に存在する場合（重複）
		if errors.Is(err, services.ErrBudgetAlreadyExists) {
			return api.PatchBudgetsId409JSONResponse{
				Error: api.ErrorResponse{
					Code:    409,
					Message: "この月のこのカテゴリの予算は既に存在します",
					Status:  api.ALREADYEXISTS,
					Details: &[]api.ErrorInfo{
						{
							Type:   api.ErrorInfoTypeErrorInfo,
							Reason: api.BUDGETALREADYEXISTS,
							Domain: "budget-calendar.example.com",
						},
					},
				},
			}, nil
		}

		// その他のエラー（データベースエラーなど）
		return api.PatchBudgetsId500JSONResponse{
			Error: api.ErrorResponse{
				Code:    500,
				Message: "エラーが発生しました",
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

	return api.PatchBudgetsId200JSONResponse{
		Budget: toAPIBudget(budget),
	}, nil
}

// DeleteBudgetsId implements api.StrictServerInterface
func (h *budgetsHandler) DeleteBudgetsId(ctx context.Context, request api.DeleteBudgetsIdRequestObject) (api.DeleteBudgetsIdResponseObject, error) {
	userID, _ := helpers.ExtractUserID(ctx)

	if err := h.service.DeleteBudget(uint(request.Id), userID); err != nil {
		// 予算が見つからない場合
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return api.DeleteBudgetsId404JSONResponse{
				Error: api.ErrorResponse{
					Code:    404,
					Message: "予算が見つかりません",
					Status:  api.NOTFOUND,
					Details: &[]api.ErrorInfo{
						{
							Type:   api.ErrorInfoTypeErrorInfo,
							Reason: api.BUDGETNOTFOUND,
							Domain: "budget-calendar.example.com",
						},
					},
				},
			}, nil
		}

		// その他のエラー（データベースエラーなど）
		return api.DeleteBudgetsId500JSONResponse{
			Error: api.ErrorResponse{
				Code:    500,
				Message: "エラーが発生しました",
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

	return api.DeleteBudgetsId204Response{}, nil
}

// toAPIBudget converts models.Budget to api.Budget
func toAPIBudget(b *models.Budget) api.Budget {
	return api.Budget{
		Id:         int32(b.ID),
		UserId:     int32(b.UserID),
		CategoryId: int32(b.CategoryID),
		Category: api.Category{
			Id:        int32(b.Category.ID),
			UserId:    int32(b.Category.UserID),
			Name:      b.Category.Name,
			Color:     b.Category.Color,
			CreatedAt: b.Category.CreatedAt,
			UpdatedAt: b.Category.UpdatedAt,
		},
		Amount:    int32(b.Amount),
		Month:     b.Month,
		CreatedAt: b.CreatedAt,
		UpdatedAt: b.UpdatedAt,
	}
}
