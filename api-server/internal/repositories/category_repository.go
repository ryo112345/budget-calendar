package repositories

import (
	"apps/internal/helpers"
	"apps/internal/models"

	"gorm.io/gorm"
)

type CategoryRepository interface {
	FindAllByUserID(userID uint) ([]models.Category, error)
	FindByID(id, userID uint) (*models.Category, error)
	Create(category *models.Category) error
	Update(id, userID uint, updates map[string]interface{}) (*models.Category, error)
	Delete(id, userID uint) error
}

type categoryRepository struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) CategoryRepository {
	return &categoryRepository{db}
}

func (r *categoryRepository) FindAllByUserID(userID uint) ([]models.Category, error) {
	var categories []models.Category
	err := r.db.Where("user_id = ?", userID).Find(&categories).Error
	return categories, err
}

func (r *categoryRepository) FindByID(id, userID uint) (*models.Category, error) {
	var category models.Category
	err := r.db.Where("id = ? AND user_id = ?", id, userID).First(&category).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return &category, nil
}

func (r *categoryRepository) Create(category *models.Category) error {
	return r.db.Create(category).Error
}

func (r *categoryRepository) Update(id, userID uint, updates map[string]interface{}) (*models.Category, error) {
	// 存在確認
	var existing models.Category
	if err := r.db.Where("id = ? AND user_id = ?", id, userID).First(&existing).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, ErrNotFound
		}
		return nil, err
	}

	// 更新
	if err := r.db.Model(&models.Category{}).Where("id = ? AND user_id = ?", id, userID).Updates(updates).Error; err != nil {
		return nil, err
	}

	// 更新後のデータを取得
	var category models.Category
	if err := r.db.Where("id = ? AND user_id = ?", id, userID).First(&category).Error; err != nil {
		return nil, err
	}

	return &category, nil
}

func (r *categoryRepository) Delete(id, userID uint) error {
	result := r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Category{})
	if result.Error != nil {
		if helpers.IsForeignKeyViolation(result.Error) {
			return ErrForeignKeyViolation
		}
		return result.Error
	}
	if result.RowsAffected == 0 {
		return ErrNotFound
	}
	return nil
}
