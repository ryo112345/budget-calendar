package services

import (
	"errors"

	api "apps/apis"
	"apps/internal/models"
	"apps/internal/repositories"
	"apps/internal/validators"
)

type BudgetService interface {
	FetchBudgets(userID uint, params *api.GetBudgetsParams) ([]models.Budget, error)
	FetchBudgetByID(id uint, userID uint) (*models.Budget, error)
	CreateBudget(userID uint, input *api.CreateBudgetInput) (*models.Budget, error)
	UpdateBudget(id uint, userID uint, input *api.UpdateBudgetInput) (*models.Budget, error)
	DeleteBudget(id uint, userID uint) error
}

type budgetService struct {
	repo repositories.BudgetRepository
}

func NewBudgetService(repo repositories.BudgetRepository) BudgetService {
	return &budgetService{repo}
}

func (s *budgetService) FetchBudgets(userID uint, params *api.GetBudgetsParams) ([]models.Budget, error) {
	var month *string
	var categoryID *int32

	if params != nil {
		month = params.Month
		categoryID = params.CategoryId
	}

	return s.repo.FindAll(userID, month, categoryID)
}

func (s *budgetService) FetchBudgetByID(id uint, userID uint) (*models.Budget, error) {
	budget, err := s.repo.FindByID(id, userID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return nil, ErrBudgetNotFound
		}
		return nil, err
	}
	return budget, nil
}

func (s *budgetService) CreateBudget(userID uint, input *api.CreateBudgetInput) (*models.Budget, error) {
	if err := validators.ValidateCreateBudget(input); err != nil {
		return nil, err
	}

	budget := models.Budget{
		UserID:     userID,
		CategoryID: uint(input.CategoryId),
		Amount:     int(input.Amount),
		Month:      input.Month,
	}

	if err := s.repo.Create(&budget); err != nil {
		if errors.Is(err, repositories.ErrDuplicateEntry) {
			return nil, ErrBudgetAlreadyExists
		}
		if errors.Is(err, repositories.ErrForeignKeyViolation) {
			return nil, ErrCategoryNotFound
		}
		return nil, err
	}

	return &budget, nil
}

func (s *budgetService) UpdateBudget(id uint, userID uint, input *api.UpdateBudgetInput) (*models.Budget, error) {
	if err := validators.ValidateUpdateBudget(input); err != nil {
		return nil, err
	}

	updates := make(map[string]interface{})

	if input.CategoryId != nil {
		updates["category_id"] = *input.CategoryId
	}
	if input.Amount != nil {
		updates["amount"] = *input.Amount
	}
	if input.Month != nil {
		updates["month"] = *input.Month
	}

	budget, err := s.repo.Update(id, userID, updates)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return nil, ErrBudgetNotFound
		}
		if errors.Is(err, repositories.ErrDuplicateEntry) {
			return nil, ErrBudgetAlreadyExists
		}
		if errors.Is(err, repositories.ErrForeignKeyViolation) {
			return nil, ErrCategoryNotFound
		}
		return nil, err
	}

	return budget, nil
}

func (s *budgetService) DeleteBudget(id uint, userID uint) error {
	err := s.repo.Delete(id, userID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return ErrBudgetNotFound
		}
		return err
	}
	return nil
}
