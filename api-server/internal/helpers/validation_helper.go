package helpers

import (
	"errors"

	"github.com/go-sql-driver/mysql"
	validation "github.com/go-ozzo/ozzo-validation/v4"
)

const (
	mysqlErrDuplicateEntry      = 1062 // UNIQUE constraint violation
	mysqlErrForeignKeyViolation = 1451 // FK RESTRICT violation
)

// ValidationErrorToMetadata はバリデーションエラーをメタデータ形式に変換する
// ハンドラー層で使用する
func ValidationErrorToMetadata(err error) map[string]string {
	metadata := make(map[string]string)
	if err == nil {
		return metadata
	}

	if errors, ok := err.(validation.Errors); ok {
		for field, errorMessage := range errors {
			metadata[field] = errorMessage.Error()
		}
	}

	return metadata
}

// IsForeignKeyViolation は外部キー制約違反かどうかを判定する
func IsForeignKeyViolation(err error) bool {
	var mysqlErr *mysql.MySQLError
	if errors.As(err, &mysqlErr) {
		return mysqlErr.Number == mysqlErrForeignKeyViolation
	}
	return false
}

// IsDuplicateEntry はユニーク制約違反かどうかを判定する
func IsDuplicateEntry(err error) bool {
	var mysqlErr *mysql.MySQLError
	if errors.As(err, &mysqlErr) {
		return mysqlErr.Number == mysqlErrDuplicateEntry
	}
	return false
}
