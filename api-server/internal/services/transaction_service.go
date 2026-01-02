package services

import (
	api "apps/apis"
	"apps/internal/models"
	"apps/internal/validators"

	"gorm.io/gorm"
)

type TransactionService interface {
	FetchTransactions(userID uint, params *api.GetTransactionsParams) ([]models.Transaction, error)
	FetchTransactionByID(id uint, userID uint) (*models.Transaction, error)
	CreateTransaction(userID uint, input *api.CreateTransactionInput) (*models.Transaction, error)
	UpdateTransaction(id uint, userID uint, input *api.UpdateTransactionInput) (*models.Transaction, error)
	DeleteTransaction(id uint, userID uint) error
}

type transactionService struct {
	db *gorm.DB
}

func NewTransactionService(db *gorm.DB) TransactionService {
	return &transactionService{db}
}

func (s *transactionService) FetchTransactions(userID uint, params *api.GetTransactionsParams) ([]models.Transaction, error) {
	var transactions []models.Transaction

	query := s.db.Preload("Category").Where("user_id = ?", userID)

	if params != nil {
		if params.StartDate != nil {
			query = query.Where("date >= ?", *params.StartDate)
		}
		if params.EndDate != nil {
			query = query.Where("date <= ?", *params.EndDate)
		}
		if params.Type != nil {
			query = query.Where("type = ?", string(*params.Type))
		}
		if params.CategoryId != nil {
			query = query.Where("category_id = ?", *params.CategoryId)
		}
	}

	err := query.Order("date DESC").Find(&transactions).Error
	return transactions, err
}

func (s *transactionService) FetchTransactionByID(id uint, userID uint) (*models.Transaction, error) {
	var transaction models.Transaction
	err := s.db.Preload("Category").Where("id = ? AND user_id = ?", id, userID).First(&transaction).Error
	if err != nil {
		return nil, err
	}
	return &transaction, nil
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
		Type:        models.TransactionType(input.Type),
		Amount:      int(input.Amount),
		Date:        input.Date.Time,
		Description: description,
	}

	if err := s.db.Create(&transaction).Error; err != nil {
		return nil, err
	}

	if err := s.db.Preload("Category").First(&transaction, transaction.ID).Error; err != nil {
		return nil, err
	}

	return &transaction, nil
}

func (s *transactionService) UpdateTransaction(id uint, userID uint, input *api.UpdateTransactionInput) (*models.Transaction, error) {
	if err := validators.ValidateUpdateTransaction(input); err != nil {
		return nil, err
	}

	var existing models.Transaction
	if err := s.db.Where("id = ? AND user_id = ?", id, userID).First(&existing).Error; err != nil {
		return nil, err
	}

	updates := make(map[string]interface{})

	if input.CategoryId != nil {
		updates["category_id"] = *input.CategoryId
	}
	if input.Type != nil {
		updates["type"] = string(*input.Type)
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

	if err := s.db.Model(&models.Transaction{}).Where("id = ? AND user_id = ?", id, userID).Updates(updates).Error; err != nil {
		return nil, err
	}

	var transaction models.Transaction
	if err := s.db.Preload("Category").Where("id = ? AND user_id = ?", id, userID).First(&transaction).Error; err != nil {
		return nil, err
	}

	return &transaction, nil
}

func (s *transactionService) DeleteTransaction(id uint, userID uint) error {
	result := s.db.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Transaction{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}
