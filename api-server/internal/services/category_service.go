package services

import (
	"github.com/yamao/budget-calendar/internal/models"
	"gorm.io/gorm"
)

type CategoryService interface {
	FetchCategoriesByUserID(userID uint) ([]models.Category, error)
	FetchCategoryByID(id uint, userID uint) (*models.Category, error)
	CreateCategory(category *models.Category) error
	UpdateCategory(id uint, userID uint, updates map[string]interface{}) error
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

func (s *categoryService) CreateCategory(category *models.Category) error {
	return s.db.Create(category).Error
}

func (s *categoryService) UpdateCategory(id uint, userID uint, updates map[string]interface{}) error {
	return s.db.Model(&models.Category{}).
		Where("id = ? AND user_id = ?", id, userID).
		Updates(updates).Error
}

func (s *categoryService) DeleteCategory(id uint, userID uint) error {
	return s.db.Where("id = ? AND user_id = ?", id, userID).
		Delete(&models.Category{}).Error
}
