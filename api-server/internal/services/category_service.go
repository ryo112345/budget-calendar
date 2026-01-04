package services

import (
	"errors"

	api "apps/apis"
	"apps/internal/models"
	"apps/internal/repositories"
	"apps/internal/validators"
)

type CategoryService interface {
	FetchCategoriesByUserID(userID uint) ([]models.Category, error)
	FetchCategoryByID(id uint, userID uint) (*models.Category, error)
	CreateCategory(userID uint, input *api.CreateCategoryInput) (*models.Category, error)
	UpdateCategory(id uint, userID uint, input *api.UpdateCategoryInput) (*models.Category, error)
	DeleteCategory(id uint, userID uint) error
}

type categoryService struct {
	repo repositories.CategoryRepository
}

func NewCategoryService(repo repositories.CategoryRepository) CategoryService {
	return &categoryService{repo}
}

func (s *categoryService) FetchCategoriesByUserID(userID uint) ([]models.Category, error) {
	return s.repo.FindAllByUserID(userID)
}

func (s *categoryService) FetchCategoryByID(id uint, userID uint) (*models.Category, error) {
	category, err := s.repo.FindByID(id, userID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return nil, ErrCategoryNotFound
		}
		return nil, err
	}
	return category, nil
}

func (s *categoryService) CreateCategory(userID uint, input *api.CreateCategoryInput) (*models.Category, error) {
	if err := validators.ValidateCreateCategory(input); err != nil {
		return nil, err
	}

	category := models.Category{
		UserID: userID,
		Name:   input.Name,
		Type:   models.CategoryType(input.Type),
		Color:  input.Color,
	}

	if err := s.repo.Create(&category); err != nil {
		return nil, err
	}

	return &category, nil
}

func (s *categoryService) UpdateCategory(id uint, userID uint, input *api.UpdateCategoryInput) (*models.Category, error) {
	if err := validators.ValidateUpdateCategory(input); err != nil {
		return nil, err
	}

	updates := make(map[string]interface{})
	if input.Name != nil {
		updates["name"] = *input.Name
	}
	if input.Color != nil {
		updates["color"] = *input.Color
	}

	category, err := s.repo.Update(id, userID, updates)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return nil, ErrCategoryNotFound
		}
		return nil, err
	}

	return category, nil
}

func (s *categoryService) DeleteCategory(id uint, userID uint) error {
	err := s.repo.Delete(id, userID)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return ErrCategoryNotFound
		}
		if errors.Is(err, repositories.ErrForeignKeyViolation) {
			return ErrCategoryInUse
		}
		return err
	}
	return nil
}
