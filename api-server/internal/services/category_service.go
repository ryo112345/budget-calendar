package services

import (
	"github.com/yamao/budget-calendar/database"
	"github.com/yamao/budget-calendar/internal/models"
)

type CategoryService struct{}

// 一覧取得
func (s *CategoryService) List(userID uint) ([]models.Category, error) {
	var categories []models.Category
	err := database.DB.Where("user_id = ?", userID).Find(&categories).Error
	return categories, err
}

// 詳細取得
func (s *CategoryService) Get(id uint, userID uint) (*models.Category, error) {
	var category models.Category
	err := database.DB.Where("id = ? AND user_id = ?", id, userID).First(&category).Error
	if err != nil {
		return nil, err
	}
	return &category, nil
}

// 作成
func (s *CategoryService) Create(category *models.Category) error {
	return database.DB.Create(category).Error
}

// 更新
func (s *CategoryService) Update(id uint, userID uint, updates map[string]interface{}) error {
	return database.DB.Model(&models.Category{}).
		Where("id = ? AND user_id = ?", id, userID).
		Updates(updates).Error
}

// 削除（論理削除）
func (s *CategoryService) Delete(id uint, userID uint) error {
	return database.DB.Where("id = ? AND user_id = ?", id, userID).
		Delete(&models.Category{}).Error
}
