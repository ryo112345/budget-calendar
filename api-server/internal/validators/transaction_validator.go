package validators

import (
	api "apps/apis"

	validation "github.com/go-ozzo/ozzo-validation/v4"
)

func ValidateCreateTransaction(input *api.CreateTransactionInput) error {
	err := validation.ValidateStruct(input,
		validation.Field(
			&input.CategoryId,
			validation.Required.Error("カテゴリIDは必須です"),
			validation.Min(1).Error("カテゴリIDは1以上で入力してください"),
		),
		validation.Field(
			&input.Amount,
			validation.Required.Error("金額は必須です"),
			validation.Min(1).Error("金額は1以上で入力してください"),
		),
		validation.Field(
			&input.Date,
			validation.Required.Error("日付は必須です"),
		),
	)
	if err != nil {
		return err
	}

	// Descriptionはオプショナルなので別途検証
	if input.Description != nil {
		if err := validation.Validate(*input.Description, validation.Length(0, 255).Error("説明は255文字以内で入力してください")); err != nil {
			return err
		}
	}

	return nil
}

func ValidateUpdateTransaction(input *api.UpdateTransactionInput) error {
	if input.CategoryId == nil &&
		input.Amount == nil &&
		input.Date == nil &&
		input.Description == nil {
		return validation.NewError("no_fields", "更新するフィールドを1つ以上指定してください")
	}

	if input.CategoryId != nil {
		if err := validation.Validate(*input.CategoryId, validation.Min(1).Error("カテゴリIDは1以上で入力してください")); err != nil {
			return err
		}
	}

	if input.Amount != nil {
		if err := validation.Validate(*input.Amount, validation.Min(1).Error("金額は1以上で入力してください")); err != nil {
			return err
		}
	}

	if input.Description != nil {
		if err := validation.Validate(*input.Description, validation.Length(0, 255).Error("説明は255文字以内で入力してください")); err != nil {
			return err
		}
	}

	return nil
}
