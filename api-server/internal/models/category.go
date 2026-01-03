package models

import "time"

type CategoryType string

const (
	CategoryTypeIncome  CategoryType = "income"
	CategoryTypeExpense CategoryType = "expense"
)

type Category struct {
	ID        uint         `gorm:"primaryKey" json:"id"`
	UserID    uint         `gorm:"not null;index" json:"user_id"`
	User      User         `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"-"`
	Name      string       `gorm:"size:100;not null" json:"name"`
	Type      CategoryType `gorm:"size:10;not null" json:"type"`
	Color     string       `gorm:"size:20" json:"color"`
	CreatedAt time.Time    `json:"created_at"`
	UpdatedAt time.Time    `json:"updated_at"`
}
