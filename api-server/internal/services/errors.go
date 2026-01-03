package services

import "errors"

// User関連エラー
var (
	ErrEmailAlreadyExists   = errors.New("email already exists")
	ErrAuthenticationFailed = errors.New("authentication failed")
)

// Transaction関連エラー
var (
	ErrTransactionNotFound = errors.New("transaction not found")
)

// Category関連エラー
var (
	ErrCategoryNotFound = errors.New("category not found")
	ErrCategoryInUse    = errors.New("category in use")
)

// Budget関連エラー
var (
	ErrBudgetNotFound      = errors.New("budget not found")
	ErrBudgetAlreadyExists = errors.New("budget already exists")
)
