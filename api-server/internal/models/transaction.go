package models

import (
	"time"

	"gorm.io/gorm"
)

type TransactionType string

const (
	TransactionTypeIncome  TransactionType = "income"
	TransactionTypeExpense TransactionType = "expense"
)

type Transaction struct {
	ID          uint            `gorm:"primaryKey" json:"id"`
	UserID      uint            `json:"user_id"`
	CategoryID  uint            `json:"category_id"`
	Category    Category        `gorm:"foreignKey:CategoryID" json:"category"`
	Type        TransactionType `gorm:"size:10;not null" json:"type"`
	Amount      int             `gorm:"not null" json:"amount"`
	Date        time.Time       `gorm:"not null" json:"date"`
	Description string          `gorm:"size:255" json:"description"`
	CreatedAt   time.Time       `json:"created_at"`
	UpdatedAt   time.Time       `json:"updated_at"`
	DeletedAt   gorm.DeletedAt  `gorm:"index" json:"-"`
}
