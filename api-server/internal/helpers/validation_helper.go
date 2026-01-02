package helpers

import (
	validation "github.com/go-ozzo/ozzo-validation/v4"
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
