package repositories

import (
	"apps/internal/helpers"
	"apps/internal/models"

	"gorm.io/gorm"
)

type BudgetRepository interface {
	FindAll(userID uint, month *string, categoryID *int32) ([]models.Budget, error)
	FindByID(id, userID uint) (*models.Budget, error)
	Create(budget *models.Budget) error
	Update(id, userID uint, updates map[string]interface{}) (*models.Budget, error)
	Delete(id, userID uint) error
}

type budgetRepository struct {
	db *gorm.DB
}

func NewBudgetRepository(db *gorm.DB) BudgetRepository {
	return &budgetRepository{db}
}

func (r *budgetRepository) FindAll(userID uint, month *string, categoryID *int32) ([]models.Budget, error) {
	var budgets []models.Budget

	query := r.db.Preload("Category").Where("user_id = ?", userID)

	if month != nil {
		query = query.Where("month = ?", *month)
	}
	if categoryID != nil {
		query = query.Where("category_id = ?", *categoryID)
	}

	err := query.Order("month DESC, category_id ASC").Find(&budgets).Error
	return budgets, err
}

func (r *budgetRepository) FindByID(id, userID uint) (*models.Budget, error) {
	var budget models.Budget
	err := r.db.Preload("Category").Where("id = ? AND user_id = ?", id, userID).First(&budget).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return &budget, nil
}

func (r *budgetRepository) Create(budget *models.Budget) error {
	if err := r.db.Create(budget).Error; err != nil {
		if helpers.IsDuplicateEntry(err) {
			return ErrDuplicateEntry
		}
		if helpers.IsForeignKeyViolation(err) {
			return ErrForeignKeyViolation
		}
		return err
	}

	// Categoryをプリロードして返す
	return r.db.Preload("Category").First(budget, budget.ID).Error
}

func (r *budgetRepository) Update(id, userID uint, updates map[string]interface{}) (*models.Budget, error) {
	// 存在確認
	var existing models.Budget
	if err := r.db.Where("id = ? AND user_id = ?", id, userID).First(&existing).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, ErrNotFound
		}
		return nil, err
	}

	// 更新
	if err := r.db.Model(&models.Budget{}).Where("id = ? AND user_id = ?", id, userID).Updates(updates).Error; err != nil {
		if helpers.IsDuplicateEntry(err) {
			return nil, ErrDuplicateEntry
		}
		if helpers.IsForeignKeyViolation(err) {
			return nil, ErrForeignKeyViolation
		}
		return nil, err
	}

	// 更新後のデータを取得
	var budget models.Budget
	if err := r.db.Preload("Category").Where("id = ? AND user_id = ?", id, userID).First(&budget).Error; err != nil {
		return nil, err
	}

	return &budget, nil
}

func (r *budgetRepository) Delete(id, userID uint) error {
	result := r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Budget{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return ErrNotFound
	}
	return nil
}
