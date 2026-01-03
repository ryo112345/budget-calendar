package services

import (
	api "apps/apis"
	"apps/internal/models"
	"apps/internal/validators"

	"gorm.io/gorm"
)

type CategoryService interface {
	FetchCategoriesByUserID(userID uint) ([]models.Category, error)
	FetchCategoryByID(id uint, userID uint) (*models.Category, error)
	CreateCategory(userID uint, input *api.CreateCategoryInput) (*models.Category, error)
	UpdateCategory(id uint, userID uint, input *api.UpdateCategoryInput) (*models.Category, error)
	DeleteCategory(id uint, userID uint) error
}

type categoryService struct {
	db *gorm.DB
}

func NewCategoryService(db *gorm.DB) CategoryService {
	return &categoryService{db}
}

func (s *categoryService) FetchCategoriesByUserID(userID uint) ([]models.Category, error) {
	var categories []models.Category
	err := s.db.Where("user_id = ?", userID).Find(&categories).Error
	return categories, err
}

func (s *categoryService) FetchCategoryByID(id uint, userID uint) (*models.Category, error) {
	var category models.Category
	err := s.db.Where("id = ? AND user_id = ?", id, userID).First(&category).Error
	if err != nil {
		return nil, err
	}
	return &category, nil
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

	if err := s.db.Create(&category).Error; err != nil {
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

	if err := s.db.Model(&models.Category{}).Where("id = ? AND user_id = ?", id, userID).Updates(updates).Error; err != nil {
		return nil, err
	}

	var category models.Category
	if err := s.db.Where("id = ? AND user_id = ?", id, userID).First(&category).Error; err != nil {
		return nil, err
	}

	return &category, nil
}

func (s *categoryService) DeleteCategory(id uint, userID uint) error {
	result := s.db.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Category{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}
