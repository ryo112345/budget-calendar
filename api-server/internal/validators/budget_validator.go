package validators

import (
	"regexp"

	api "apps/apis"

	validation "github.com/go-ozzo/ozzo-validation/v4"
)

var monthRegex = regexp.MustCompile(`^\d{4}-(0[1-9]|1[0-2])$`)

func ValidateCreateBudget(input *api.CreateBudgetInput) error {
	return validation.ValidateStruct(input,
		validation.Field(&input.CategoryId, RequiredCategoryID...),
		validation.Field(&input.Amount,
			validation.Required.Error("予算額は必須です"),
			validation.Min(1).Error("予算額は1以上で入力してください"),
		),
		validation.Field(&input.Month,
			validation.Required.Error("月は必須です"),
			validation.Match(monthRegex).Error("月はYYYY-MM形式で入力してください"),
		),
	)
}

func ValidateUpdateBudget(input *api.UpdateBudgetInput) error {
	return validation.ValidateStruct(input,
		validation.Field(&input.CategoryId,
			validation.By(atLeastOneField(func() bool {
				return input.CategoryId != nil || input.Amount != nil || input.Month != nil
			})),
			OptionalCategoryID,
		),
		validation.Field(&input.Amount, validation.Min(1).Error("予算額は1以上で入力してください")),
		validation.Field(&input.Month, validation.Match(monthRegex).Error("月はYYYY-MM形式で入力してください")),
	)
}
