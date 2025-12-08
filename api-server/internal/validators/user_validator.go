package validators

import (
	api "apps/apis"
	"regexp"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/go-ozzo/ozzo-validation/v4/is"
)

func ValidateSignUp(input *api.UserSignUpInput) error {
	return validation.ValidateStruct(input,
		validation.Field(
			&input.Name,
			validation.Required.Error("ユーザー名は必須入力です。"),
			validation.RuneLength(1, 20).Error("ユーザー名は1 ~ 20文字での入力をお願いします。"),
		),
		validation.Field(
			&input.Email,
			validation.Required.Error("Emailは必須入力です。"),
			is.Email.Error("Emailの形式での入力をお願いします。"),
		),
		validation.Field(
			&input.Password,
			validation.Required.Error("パスワードは必須入力です。"),
			validation.RuneLength(8, 24).Error("パスワードは8 ~ 24文字での入力をお願いします。"),
			validation.Match(regexp.MustCompile(`[A-Z]`)).Error("パスワードには大文字を含めてください。"),
			validation.Match(regexp.MustCompile(`[a-z]`)).Error("パスワードには小文字を含めてください。"),
			validation.Match(regexp.MustCompile(`[0-9]`)).Error("パスワードには数字を含めてください。"),
		),
	)
}

func ValidateSignIn(input *api.UserSignInInput) error {
	return validation.ValidateStruct(input,
		validation.Field(
			&input.Email,
			validation.Required.Error("Emailは必須入力です。"),
			is.Email.Error("Emailの形式での入力をお願いします。"),
		),
		validation.Field(
			&input.Password,
			validation.Required.Error("パスワードは必須入力です。"),
		),
	)
}
