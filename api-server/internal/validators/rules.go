package validators

import (
	validation "github.com/go-ozzo/ozzo-validation/v4"
)

// 共通バリデーションルール（複数のバリデータで使用）
var (
	// カテゴリID（transaction, budget で使用）
	RequiredCategoryID = []validation.Rule{
		validation.Required.Error("カテゴリIDは必須です"),
		validation.Min(1).Error("カテゴリIDは1以上で入力してください"),
	}
	OptionalCategoryID = validation.Min(1).Error("カテゴリIDは1以上で入力してください")
)

// atLeastOneField は少なくとも1つのフィールドが指定されているかチェックするルールを生成する
func atLeastOneField(hasValue func() bool) validation.RuleFunc {
	return func(value interface{}) error {
		if !hasValue() {
			return validation.NewError("no_fields", "更新するフィールドを1つ以上指定してください")
		}
		return nil
	}
}
