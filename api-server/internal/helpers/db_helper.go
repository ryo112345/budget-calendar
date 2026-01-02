package helpers

import (
	"errors"

	"github.com/go-sql-driver/mysql"
)

const (
	mysqlErrDuplicateEntry             = 1062 // UNIQUE constraint violation
	mysqlErrForeignKeyViolationParent  = 1451 // FK violation: cannot delete/update parent row
	mysqlErrForeignKeyViolationChild   = 1452 // FK violation: cannot add/update child row
)

// IsForeignKeyViolation は外部キー制約違反かどうかを判定する
func IsForeignKeyViolation(err error) bool {
	var mysqlErr *mysql.MySQLError
	if errors.As(err, &mysqlErr) {
		return mysqlErr.Number == mysqlErrForeignKeyViolationParent ||
			mysqlErr.Number == mysqlErrForeignKeyViolationChild
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
