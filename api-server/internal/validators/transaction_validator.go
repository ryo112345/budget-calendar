package validators

import (
	api "apps/apis"

	validation "github.com/go-ozzo/ozzo-validation/v4"
)

func ValidateCreateTransaction(input *api.CreateTransactionInput) error {
	return validation.ValidateStruct(input,
		validation.Field(&input.CategoryId, RequiredCategoryID...),
		validation.Field(&input.Amount,
			validation.Required.Error("金額は必須です"),
			validation.Min(1).Error("金額は1以上で入力してください"),
		),
		validation.Field(&input.Date, validation.Required.Error("日付は必須です")),
		validation.Field(&input.Description,
			validation.NilOrNotEmpty.Error("説明を入力する場合は空にしないでください"),
			validation.Length(0, 255).Error("説明は255文字以内で入力してください"),
		),
	)
}

func ValidateUpdateTransaction(input *api.UpdateTransactionInput) error {
	return validation.ValidateStruct(input,
		validation.Field(&input.CategoryId,
			validation.By(atLeastOneField(func() bool {
				return input.CategoryId != nil || input.Amount != nil || input.Date != nil || input.Description != nil
			})),
			OptionalCategoryID,
		),
		validation.Field(&input.Amount, validation.Min(1).Error("金額は1以上で入力してください")),
		validation.Field(&input.Description,
			validation.NilOrNotEmpty.Error("説明を入力する場合は空にしないでください"),
			validation.Length(0, 255).Error("説明は255文字以内で入力してください"),
		),
	)
}
