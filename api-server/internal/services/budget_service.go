package services

import (
	"errors"

	api "apps/apis"
	"apps/internal/models"
	"apps/internal/validators"

	"gorm.io/gorm"
)

var ErrBudgetAlreadyExists = errors.New("budget already exists for this category and month")

type BudgetService interface {
	FetchBudgets(userID uint, params *api.GetBudgetsParams) ([]models.Budget, error)
	FetchBudgetByID(id uint, userID uint) (*models.Budget, error)
	CreateBudget(userID uint, input *api.CreateBudgetInput) (*models.Budget, error)
	UpdateBudget(id uint, userID uint, input *api.UpdateBudgetInput) (*models.Budget, error)
	DeleteBudget(id uint, userID uint) error
}

type budgetService struct {
	db *gorm.DB
}

func NewBudgetService(db *gorm.DB) BudgetService {
	return &budgetService{db}
}

func (s *budgetService) FetchBudgets(userID uint, params *api.GetBudgetsParams) ([]models.Budget, error) {
	var budgets []models.Budget

	query := s.db.Preload("Category").Where("user_id = ?", userID)

	if params != nil {
		if params.Month != nil {
			query = query.Where("month = ?", *params.Month)
		}
		if params.CategoryId != nil {
			query = query.Where("category_id = ?", *params.CategoryId)
		}
	}

	err := query.Order("month DESC, category_id ASC").Find(&budgets).Error
	return budgets, err
}

func (s *budgetService) FetchBudgetByID(id uint, userID uint) (*models.Budget, error) {
	var budget models.Budget
	err := s.db.Preload("Category").Where("id = ? AND user_id = ?", id, userID).First(&budget).Error
	if err != nil {
		return nil, err
	}
	return &budget, nil
}

func (s *budgetService) CreateBudget(userID uint, input *api.CreateBudgetInput) (*models.Budget, error) {
	if err := validators.ValidateCreateBudget(input); err != nil {
		return nil, err
	}

	// カテゴリの存在確認
	var category models.Category
	if err := s.db.Where("id = ? AND user_id = ?", input.CategoryId, userID).First(&category).Error; err != nil {
		return nil, err
	}

	// 同じ月・カテゴリの予算が既に存在するかチェック
	var existingBudget models.Budget
	err := s.db.Where("user_id = ? AND category_id = ? AND month = ?", userID, input.CategoryId, input.Month).First(&existingBudget).Error
	if err == nil {
		return nil, ErrBudgetAlreadyExists
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	budget := models.Budget{
		UserID:     userID,
		CategoryID: uint(input.CategoryId),
		Amount:     int(input.Amount),
		Month:      input.Month,
	}

	if err := s.db.Create(&budget).Error; err != nil {
		return nil, err
	}

	// Categoryをプリロードして返す
	if err := s.db.Preload("Category").First(&budget, budget.ID).Error; err != nil {
		return nil, err
	}

	return &budget, nil
}

func (s *budgetService) UpdateBudget(id uint, userID uint, input *api.UpdateBudgetInput) (*models.Budget, error) {
	if err := validators.ValidateUpdateBudget(input); err != nil {
		return nil, err
	}

	// 予算の存在確認
	var existing models.Budget
	if err := s.db.Where("id = ? AND user_id = ?", id, userID).First(&existing).Error; err != nil {
		return nil, err
	}

	updates := make(map[string]interface{})

	if input.CategoryId != nil {
		// カテゴリの存在確認
		var category models.Category
		if err := s.db.Where("id = ? AND user_id = ?", *input.CategoryId, userID).First(&category).Error; err != nil {
			return nil, err
		}
		updates["category_id"] = *input.CategoryId
	}
	if input.Amount != nil {
		updates["amount"] = *input.Amount
	}
	if input.Month != nil {
		updates["month"] = *input.Month
	}

	// 月またはカテゴリが変更される場合、重複チェック
	newCategoryID := existing.CategoryID
	newMonth := existing.Month
	if input.CategoryId != nil {
		newCategoryID = uint(*input.CategoryId)
	}
	if input.Month != nil {
		newMonth = *input.Month
	}

	if newCategoryID != existing.CategoryID || newMonth != existing.Month {
		var conflictBudget models.Budget
		err := s.db.Where("user_id = ? AND category_id = ? AND month = ? AND id != ?", userID, newCategoryID, newMonth, id).First(&conflictBudget).Error
		if err == nil {
			return nil, ErrBudgetAlreadyExists
		}
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, err
		}
	}

	if err := s.db.Model(&models.Budget{}).Where("id = ? AND user_id = ?", id, userID).Updates(updates).Error; err != nil {
		return nil, err
	}

	var budget models.Budget
	if err := s.db.Preload("Category").Where("id = ? AND user_id = ?", id, userID).First(&budget).Error; err != nil {
		return nil, err
	}

	return &budget, nil
}

func (s *budgetService) DeleteBudget(id uint, userID uint) error {
	result := s.db.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Budget{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}
