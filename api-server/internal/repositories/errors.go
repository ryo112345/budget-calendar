package repositories

import "errors"

// Repository層の汎用エラー
// DB固有のエラーをこれらに変換することで、Service層はDB実装を意識しない
var (
	ErrNotFound            = errors.New("record not found")
	ErrDuplicateEntry      = errors.New("duplicate entry")
	ErrForeignKeyViolation = errors.New("foreign key violation")
)
