package validators

import (
	"regexp"

	api "apps/apis"

	validation "github.com/go-ozzo/ozzo-validation/v4"
)

var monthRegex = regexp.MustCompile(`^\d{4}-(0[1-9]|1[0-2])$`)

func ValidateCreateBudget(input *api.CreateBudgetInput) error {
	return validation.ValidateStruct(input,
		validation.Field(
			&input.CategoryId,
			validation.Required.Error("カテゴリIDは必須です"),
			validation.Min(1).Error("カテゴリIDは1以上で入力してください"),
		),
		validation.Field(
			&input.Amount,
			validation.Required.Error("予算額は必須です"),
			validation.Min(1).Error("予算額は1以上で入力してください"),
		),
		validation.Field(
			&input.Month,
			validation.Required.Error("月は必須です"),
			validation.Match(monthRegex).Error("月はYYYY-MM形式で入力してください"),
		),
	)
}

func ValidateUpdateBudget(input *api.UpdateBudgetInput) error {
	if input.CategoryId == nil &&
		input.Amount == nil &&
		input.Month == nil {
		return validation.NewError("no_fields", "更新するフィールドを1つ以上指定してください")
	}

	if input.CategoryId != nil {
		if err := validation.Validate(*input.CategoryId, validation.Min(1).Error("カテゴリIDは1以上で入力してください")); err != nil {
			return err
		}
	}

	if input.Amount != nil {
		if err := validation.Validate(*input.Amount, validation.Min(1).Error("予算額は1以上で入力してください")); err != nil {
			return err
		}
	}

	if input.Month != nil {
		if err := validation.Validate(*input.Month, validation.Match(monthRegex).Error("月はYYYY-MM形式で入力してください")); err != nil {
			return err
		}
	}

	return nil
}
