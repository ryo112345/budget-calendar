package services

import (
	"errors"

	api "apps/apis"
	"apps/internal/models"
	"apps/internal/repositories"
	"apps/internal/validators"
)

type TransactionService interface {
	FetchTransactions(userID uint, params *api.GetTransactionsParams) ([]models.Transaction, error)
	FetchTransactionByID(id uint, userID uint) (*models.Transaction, error)
	CreateTransaction(userID uint, input *api.CreateTransactionInput) (*models.Transaction, error)
	UpdateTransaction(id uint, userID uint, input *api.UpdateTransactionInput) (*models.Transaction, error)
	DeleteTransaction(id uint, userID uint) error
}

type transactionService struct {
	repo repositories.TransactionRepository
}

func NewTransactionService(repo repositories.TransactionRepository) TransactionService {
	return &transactionService{repo}
}

func (s *transactionService) FetchTransactions(userID uint, params *api.GetTransactionsParams) ([]models.Transaction, error) {
	var repoParams *repositories.TransactionFindParams

	if params != nil {
		repoParams = &repositories.TransactionFindParams{
			StartDate:  params.StartDate,
			EndDate:    params.EndDate,
			CategoryID: params.CategoryId,
		}
		if params.Type != nil {
			typeStr := string(*params.Type)
			repoParams.Type = &typeStr
		}
	}

	return s.repo.FindAll(userID, repoParams)
}

func (s *transactionService) FetchTransactionByID(id uint, userID uint) (*models.Transaction, error) {
	transaction, err := s.repo.FindByID(id, userID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return nil, ErrTransactionNotFound
		}
		return nil, err
	}
	return transaction, nil
}

func (s *transactionService) CreateTransaction(userID uint, input *api.CreateTransactionInput) (*models.Transaction, error) {
	if err := validators.ValidateCreateTransaction(input); err != nil {
		return nil, err
	}

	description := ""
	if input.Description != nil {
		description = *input.Description
	}

	transaction := models.Transaction{
		UserID:      userID,
		CategoryID:  uint(input.CategoryId),
		Amount:      int(input.Amount),
		Date:        input.Date.Time,
		Description: description,
	}

	if err := s.repo.Create(&transaction); err != nil {
		if errors.Is(err, repositories.ErrForeignKeyViolation) {
			return nil, ErrCategoryNotFound
		}
		return nil, err
	}

	return &transaction, nil
}

func (s *transactionService) UpdateTransaction(id uint, userID uint, input *api.UpdateTransactionInput) (*models.Transaction, error) {
	if err := validators.ValidateUpdateTransaction(input); err != nil {
		return nil, err
	}

	updates := make(map[string]interface{})

	if input.CategoryId != nil {
		updates["category_id"] = *input.CategoryId
	}
	if input.Amount != nil {
		updates["amount"] = *input.Amount
	}
	if input.Date != nil {
		updates["date"] = input.Date.Time
	}
	if input.Description != nil {
		updates["description"] = *input.Description
	}

	transaction, err := s.repo.Update(id, userID, updates)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return nil, ErrTransactionNotFound
		}
		if errors.Is(err, repositories.ErrForeignKeyViolation) {
			return nil, ErrCategoryNotFound
		}
		return nil, err
	}

	return transaction, nil
}

func (s *transactionService) DeleteTransaction(id uint, userID uint) error {
	err := s.repo.Delete(id, userID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return ErrTransactionNotFound
		}
		return err
	}
	return nil
}
