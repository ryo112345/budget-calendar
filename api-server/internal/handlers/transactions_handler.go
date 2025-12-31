package handlers

import (
	"context"
	"errors"

	api "apps/apis"
	"apps/internal/helpers"
	"apps/internal/models"
	"apps/internal/services"

	"github.com/oapi-codegen/runtime/types"
	"gorm.io/gorm"
)

type TransactionsHandler interface {
	// Get transactions
	// (GET /transactions)
	GetTransactions(ctx context.Context, request api.GetTransactionsRequestObject) (api.GetTransactionsResponseObject, error)
	// Create transaction
	// (POST /transactions)
	PostTransactions(ctx context.Context, request api.PostTransactionsRequestObject) (api.PostTransactionsResponseObject, error)
	// Get transaction by ID
	// (GET /transactions/{id})
	GetTransactionsId(ctx context.Context, request api.GetTransactionsIdRequestObject) (api.GetTransactionsIdResponseObject, error)
	// Update transaction
	// (PATCH /transactions/{id})
	PatchTransactionsId(ctx context.Context, request api.PatchTransactionsIdRequestObject) (api.PatchTransactionsIdResponseObject, error)
	// Delete transaction
	// (DELETE /transactions/{id})
	DeleteTransactionsId(ctx context.Context, request api.DeleteTransactionsIdRequestObject) (api.DeleteTransactionsIdResponseObject, error)
}

type transactionsHandler struct {
	service services.TransactionService
}

func NewTransactionsHandler(service services.TransactionService) TransactionsHandler {
	return &transactionsHandler{service: service}
}

// GetTransactions implements api.StrictServerInterface
func (h *transactionsHandler) GetTransactions(ctx context.Context, request api.GetTransactionsRequestObject) (api.GetTransactionsResponseObject, error) {
	userID, _ := helpers.ExtractUserID(ctx)

	transactions, err := h.service.FetchTransactions(userID, &request.Params)
	if err != nil {
		return api.GetTransactions500JSONResponse{
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

	apiTransactions := make([]api.Transaction, len(transactions))
	for i, t := range transactions {
		apiTransactions[i] = toAPITransaction(&t)
	}

	return api.GetTransactions200JSONResponse{
		Transactions: apiTransactions,
	}, nil
}

// PostTransactions implements api.StrictServerInterface
func (h *transactionsHandler) PostTransactions(ctx context.Context, request api.PostTransactionsRequestObject) (api.PostTransactionsResponseObject, error) {
	userID, _ := helpers.ExtractUserID(ctx)

	transaction, err := h.service.CreateTransaction(userID, request.Body)
	if err != nil {
		// バリデーションエラーの場合
		metadata := helpers.ValidationErrorToMetadata(err)
		if len(metadata) > 0 {
			return api.PostTransactions400JSONResponse{
				Error: api.ErrorResponse{
					Code:    400,
					Message: "入力内容に誤りがあります",
					Status:  api.INVALIDARGUMENT,
					Details: &[]api.ErrorInfo{
						{
							Type:     api.ErrorInfoTypeErrorInfo,
							Reason:   api.INVALIDAMOUNT,
							Domain:   "budget-calendar.example.com",
							Metadata: &metadata,
						},
					},
				},
			}, nil
		}

		// カテゴリが見つからない場合
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return api.PostTransactions400JSONResponse{
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

		return api.PostTransactions500JSONResponse{
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

	return api.PostTransactions201JSONResponse{
		Transaction: toAPITransaction(transaction),
	}, nil
}

// GetTransactionsId implements api.StrictServerInterface
func (h *transactionsHandler) GetTransactionsId(ctx context.Context, request api.GetTransactionsIdRequestObject) (api.GetTransactionsIdResponseObject, error) {
	userID, _ := helpers.ExtractUserID(ctx)

	transaction, err := h.service.FetchTransactionByID(uint(request.Id), userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return api.GetTransactionsId404JSONResponse{
				Error: api.ErrorResponse{
					Code:    404,
					Message: "取引が見つかりません",
					Status:  api.NOTFOUND,
					Details: &[]api.ErrorInfo{
						{
							Type:   api.ErrorInfoTypeErrorInfo,
							Reason: api.TRANSACTIONNOTFOUND,
							Domain: "budget-calendar.example.com",
						},
					},
				},
			}, nil
		}

		return api.GetTransactionsId500JSONResponse{
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

	return api.GetTransactionsId200JSONResponse{
		Transaction: toAPITransaction(transaction),
	}, nil
}

// PatchTransactionsId implements api.StrictServerInterface
func (h *transactionsHandler) PatchTransactionsId(ctx context.Context, request api.PatchTransactionsIdRequestObject) (api.PatchTransactionsIdResponseObject, error) {
	userID, _ := helpers.ExtractUserID(ctx)

	transaction, err := h.service.UpdateTransaction(uint(request.Id), userID, request.Body)
	if err != nil {
		// バリデーションエラーの場合
		metadata := helpers.ValidationErrorToMetadata(err)
		if len(metadata) > 0 {
			return api.PatchTransactionsId400JSONResponse{
				Error: api.ErrorResponse{
					Code:    400,
					Message: "入力内容に誤りがあります",
					Status:  api.INVALIDARGUMENT,
					Details: &[]api.ErrorInfo{
						{
							Type:     api.ErrorInfoTypeErrorInfo,
							Reason:   api.INVALIDAMOUNT,
							Domain:   "budget-calendar.example.com",
							Metadata: &metadata,
						},
					},
				},
			}, nil
		}

		// 取引またはカテゴリが見つからない場合
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return api.PatchTransactionsId404JSONResponse{
				Error: api.ErrorResponse{
					Code:    404,
					Message: "取引が見つかりません",
					Status:  api.NOTFOUND,
					Details: &[]api.ErrorInfo{
						{
							Type:   api.ErrorInfoTypeErrorInfo,
							Reason: api.TRANSACTIONNOTFOUND,
							Domain: "budget-calendar.example.com",
						},
					},
				},
			}, nil
		}

		// その他のエラー（データベースエラーなど）
		return api.PatchTransactionsId500JSONResponse{
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

	return api.PatchTransactionsId200JSONResponse{
		Transaction: toAPITransaction(transaction),
	}, nil
}

// DeleteTransactionsId implements api.StrictServerInterface
func (h *transactionsHandler) DeleteTransactionsId(ctx context.Context, request api.DeleteTransactionsIdRequestObject) (api.DeleteTransactionsIdResponseObject, error) {
	userID, _ := helpers.ExtractUserID(ctx)

	if err := h.service.DeleteTransaction(uint(request.Id), userID); err != nil {
		// 取引が見つからない場合
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return api.DeleteTransactionsId404JSONResponse{
				Error: api.ErrorResponse{
					Code:    404,
					Message: "取引が見つかりません",
					Status:  api.NOTFOUND,
					Details: &[]api.ErrorInfo{
						{
							Type:   api.ErrorInfoTypeErrorInfo,
							Reason: api.TRANSACTIONNOTFOUND,
							Domain: "budget-calendar.example.com",
						},
					},
				},
			}, nil
		}

		// その他のエラー（データベースエラーなど）
		return api.DeleteTransactionsId500JSONResponse{
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

	return api.DeleteTransactionsId204Response{}, nil
}

// toAPITransaction converts models.Transaction to api.Transaction
func toAPITransaction(t *models.Transaction) api.Transaction {
	return api.Transaction{
		Id:          int32(t.ID),
		UserId:      int32(t.UserID),
		CategoryId:  int32(t.CategoryID),
		Category: api.Category{
			Id:        int32(t.Category.ID),
			UserId:    int32(t.Category.UserID),
			Name:      t.Category.Name,
			Color:     t.Category.Color,
			CreatedAt: t.Category.CreatedAt,
			UpdatedAt: t.Category.UpdatedAt,
		},
		Type:        api.TransactionType(t.Type),
		Amount:      int32(t.Amount),
		Date:        types.Date{Time: t.Date},
		Description: t.Description,
		CreatedAt:   t.CreatedAt,
		UpdatedAt:   t.UpdatedAt,
	}
}
