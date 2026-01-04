package repositories

import (
	"apps/internal/helpers"
	"apps/internal/models"

	"gorm.io/gorm"
)

type TransactionFindParams struct {
	StartDate  *string
	EndDate    *string
	Type       *string
	CategoryID *int32
}

type TransactionRepository interface {
	FindAll(userID uint, params *TransactionFindParams) ([]models.Transaction, error)
	FindByID(id, userID uint) (*models.Transaction, error)
	Create(transaction *models.Transaction) error
	Update(id, userID uint, updates map[string]interface{}) (*models.Transaction, error)
	Delete(id, userID uint) error
}

type transactionRepository struct {
	db *gorm.DB
}

func NewTransactionRepository(db *gorm.DB) TransactionRepository {
	return &transactionRepository{db}
}

func (r *transactionRepository) FindAll(userID uint, params *TransactionFindParams) ([]models.Transaction, error) {
	var transactions []models.Transaction

	query := r.db.Preload("Category").Where("user_id = ?", userID)

	if params != nil {
		if params.StartDate != nil {
			query = query.Where("date >= ?", *params.StartDate)
		}
		if params.EndDate != nil {
			query = query.Where("date <= ?", *params.EndDate)
		}
		if params.Type != nil {
			query = query.Joins("JOIN categories ON categories.id = transactions.category_id").
				Where("categories.type = ?", *params.Type)
		}
		if params.CategoryID != nil {
			query = query.Where("category_id = ?", *params.CategoryID)
		}
	}

	err := query.Order("date DESC").Find(&transactions).Error
	return transactions, err
}

func (r *transactionRepository) FindByID(id, userID uint) (*models.Transaction, error) {
	var transaction models.Transaction
	err := r.db.Preload("Category").Where("id = ? AND user_id = ?", id, userID).First(&transaction).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return &transaction, nil
}

func (r *transactionRepository) Create(transaction *models.Transaction) error {
	if err := r.db.Create(transaction).Error; err != nil {
		if helpers.IsForeignKeyViolation(err) {
			return ErrForeignKeyViolation
		}
		return err
	}

	// Categoryをプリロードして返す
	return r.db.Preload("Category").First(transaction, transaction.ID).Error
}

func (r *transactionRepository) Update(id, userID uint, updates map[string]interface{}) (*models.Transaction, error) {
	// 存在確認
	var existing models.Transaction
	if err := r.db.Where("id = ? AND user_id = ?", id, userID).First(&existing).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, ErrNotFound
		}
		return nil, err
	}

	// 更新
	if err := r.db.Model(&models.Transaction{}).Where("id = ? AND user_id = ?", id, userID).Updates(updates).Error; err != nil {
		if helpers.IsForeignKeyViolation(err) {
			return nil, ErrForeignKeyViolation
		}
		return nil, err
	}

	// 更新後のデータを取得
	var transaction models.Transaction
	if err := r.db.Preload("Category").Where("id = ? AND user_id = ?", id, userID).First(&transaction).Error; err != nil {
		return nil, err
	}

	return &transaction, nil
}

func (r *transactionRepository) Delete(id, userID uint) error {
	result := r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Transaction{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return ErrNotFound
	}
	return nil
}
