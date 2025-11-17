package validators

import (
	api "github.com/yamao/budget-calendar/apis"

	validation "github.com/go-ozzo/ozzo-validation/v4"
)

func ValidateCreateCategory(input *api.CreateCategoryInput) error {
	return validation.ValidateStruct(input,
		validation.Field(
			&input.Name,
			validation.Required.Error("カテゴリ名は必須です"),
			validation.Length(1, 100).Error("カテゴリ名は1〜100文字で入力してください"),
		),
		validation.Field(
			&input.Color,
			validation.Required.Error("色は必須です"),
			validation.Length(1, 20).Error("色は1〜20文字で入力してください"),
		),
	)
}

func ValidateUpdateCategory(input *api.UpdateCategoryInput) error {
	return validation.ValidateStruct(input,
		validation.Field(
			input.Name,
			validation.Length(1, 100).Error("カテゴリ名は1〜100文字で入力してください"),
		),
		validation.Field(
			input.Color,
			validation.Length(1, 20).Error("色は1〜20文字で入力してください"),
		),
	)
}
