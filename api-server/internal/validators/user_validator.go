package validators

import (
	"regexp"

	api "apps/apis"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/go-ozzo/ozzo-validation/v4/is"
)

var (
	uppercaseRule = regexp.MustCompile(`[A-Z]`)
	lowercaseRule = regexp.MustCompile(`[a-z]`)
	digitRule     = regexp.MustCompile(`[0-9]`)
)

func ValidateSignUp(input *api.UserSignUpInput) error {
	return validation.ValidateStruct(input,
		validation.Field(&input.Name,
			validation.Required.Error("ユーザー名は必須入力です。"),
			validation.RuneLength(1, 20).Error("ユーザー名は1 ~ 20文字での入力をお願いします。"),
		),
		validation.Field(&input.Email,
			validation.Required.Error("Emailは必須入力です。"),
			is.Email.Error("Emailの形式での入力をお願いします。"),
		),
		validation.Field(&input.Password,
			validation.Required.Error("パスワードは必須入力です。"),
			validation.RuneLength(8, 24).Error("パスワードは8 ~ 24文字での入力をお願いします。"),
			validation.Match(uppercaseRule).Error("パスワードには大文字を含めてください。"),
			validation.Match(lowercaseRule).Error("パスワードには小文字を含めてください。"),
			validation.Match(digitRule).Error("パスワードには数字を含めてください。"),
		),
	)
}

func ValidateSignIn(input *api.UserSignInInput) error {
	return validation.ValidateStruct(input,
		validation.Field(&input.Email, validation.Required.Error("Emailは必須入力です。")),
		validation.Field(&input.Password, validation.Required.Error("パスワードは必須入力です。")),
	)
}
