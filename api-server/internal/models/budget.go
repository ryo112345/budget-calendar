package models

import (
	"time"

	"gorm.io/gorm"
)

type Budget struct {
	ID         uint           `gorm:"primaryKey" json:"id"`
	UserID     uint           `json:"user_id"`
	CategoryID uint           `json:"category_id"`
	Category   Category       `gorm:"foreignKey:CategoryID" json:"category"`
	Amount     int            `gorm:"not null" json:"amount"`
	Month      string         `gorm:"size:7;not null" json:"month"` // YYYY-MM形式
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}
