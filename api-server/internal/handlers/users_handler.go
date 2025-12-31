package handlers

import (
	api "apps/apis"
	"apps/internal/helpers"
	"apps/internal/services"
	"context"
	"errors"
	"net/http"
	"os"
)

type UsersHandler interface {
	// User SignUp
	// (POST /users/signUp)
	PostUsersSignUp(ctx context.Context, request api.PostUsersSignUpRequestObject) (api.PostUsersSignUpResponseObject, error)
	// User SignIn
	// (POST /users/signIn)
	PostUsersSignIn(ctx context.Context, request api.PostUsersSignInRequestObject) (api.PostUsersSignInResponseObject, error)
	// User CheckSignedIn
	// (GET /users/checkSignedIn)
	GetUsersCheckSignedIn(ctx context.Context, request api.GetUsersCheckSignedInRequestObject) (api.GetUsersCheckSignedInResponseObject, error)
}

type usersHandler struct {
	userService services.UserService
}

func NewUsersHandler(userService services.UserService) UsersHandler {
	return &usersHandler{userService}
}

func (uh *usersHandler) PostUsersSignUp(ctx context.Context, request api.PostUsersSignUpRequestObject) (api.PostUsersSignUpResponseObject, error) {
	// サービス層でビジネスロジック実行（バリデーション含む）
	signUpErr := uh.userService.SignUp(request.Body)
	if signUpErr != nil {
		// バリデーションエラーの場合
		metadata := helpers.ValidationErrorToMetadata(signUpErr)
		if len(metadata) > 0 {
			return api.PostUsersSignUp400JSONResponse{
				Error: api.ErrorResponse{
					Code:    400,
					Message: "入力内容に誤りがあります",
					Status:  api.INVALIDARGUMENT,
					Details: &[]api.ErrorInfo{
						{
							Type:     api.ErrorInfoTypeErrorInfo,
							Reason:   api.INVALIDEMAIL,
							Domain:   "budget-calendar.example.com",
							Metadata: &metadata,
						},
					},
				},
			}, nil
		}

		// メール重複エラーの場合
		if errors.Is(signUpErr, services.ErrEmailAlreadyExists) {
			return api.PostUsersSignUp409JSONResponse{
				Error: api.ErrorResponse{
					Code:    409,
					Message: "このメールアドレスは既に登録されています",
					Status:  api.ALREADYEXISTS,
					Details: &[]api.ErrorInfo{
						{
							Type:   api.ErrorInfoTypeErrorInfo,
							Reason: api.EMAILALREADYEXISTS,
							Domain: "budget-calendar.example.com",
						},
					},
				},
			}, nil
		}

		// その他のエラー
		return api.PostUsersSignUp500JSONResponse{
			Error: api.ErrorResponse{
				Code:    500,
				Message: "エラーが発生しました",
				Status:  api.INTERNAL,
				Details: &[]api.ErrorInfo{
					{
						Type:   api.ErrorInfoTypeErrorInfo,
						Reason: api.UNKNOWNERROR,
						Domain: "budget-calendar.example.com",
					},
				},
			},
		}, nil
	}

	return api.PostUsersSignUp200JSONResponse{
		Message: "ユーザー登録が完了しました",
	}, nil
}

func (uh *usersHandler) PostUsersSignIn(ctx context.Context, request api.PostUsersSignInRequestObject) (api.PostUsersSignInResponseObject, error) {
	tokenString, err := uh.userService.SignIn(request.Body)
	if err != nil {
		// バリデーションエラーの場合
		metadata := helpers.ValidationErrorToMetadata(err)
		if len(metadata) > 0 {
			return api.PostUsersSignIn400JSONResponse{
				Error: api.ErrorResponse{
					Code:    400,
					Message: "入力内容に誤りがあります",
					Status:  api.INVALIDARGUMENT,
					Details: &[]api.ErrorInfo{
						{
							Type:     api.ErrorInfoTypeErrorInfo,
							Reason:   api.INVALIDEMAIL,
							Domain:   "budget-calendar.example.com",
							Metadata: &metadata,
						},
					},
				},
			}, nil
		}

		// 認証エラー
		if errors.Is(err, services.ErrAuthenticationFailed) {
			return api.PostUsersSignIn401JSONResponse{
				Error: api.ErrorResponse{
					Code:    401,
					Message: "メールアドレスまたはパスワードが正しくありません",
					Status:  api.UNAUTHENTICATED,
					Details: &[]api.ErrorInfo{
						{
							Type:   api.ErrorInfoTypeErrorInfo,
							Reason: api.INVALIDCREDENTIALS,
							Domain: "budget-calendar.example.com",
						},
					},
				},
			}, nil
		}

		// その他のエラー
		return api.PostUsersSignIn500JSONResponse{
			Error: api.ErrorResponse{
				Code:    500,
				Message: "エラーが発生しました",
				Status:  api.INTERNAL,
				Details: &[]api.ErrorInfo{
					{
						Type:   api.ErrorInfoTypeErrorInfo,
						Reason: api.UNKNOWNERROR,
						Domain: "budget-calendar.example.com",
					},
				},
			},
		}, nil
	}

	var sameSite http.SameSite
	if os.Getenv("APP_ENV") == "production" {
		sameSite = http.SameSiteNoneMode
	} else {
		sameSite = http.SameSiteDefaultMode
	}

	// NOTE: Cookieにtokenをセット
	cookie := &http.Cookie{
		Name:     "token",
		Value:    tokenString,
		MaxAge:   3600 * 24,
		Path:     "/",
		Domain:   os.Getenv("API_ORIGIN"),
		SameSite: sameSite,
		Secure:   os.Getenv("APP_ENV") == "production",
		HttpOnly: true,
	}

	return api.PostUsersSignIn200JSONResponse{
		Body: api.UserUserSignInResponse{},
		Headers: api.PostUsersSignIn200ResponseHeaders{
			SetCookie: cookie.String(),
		},
	}, nil
}

func (uh *usersHandler) GetUsersCheckSignedIn(ctx context.Context, request api.GetUsersCheckSignedInRequestObject) (api.GetUsersCheckSignedInResponseObject, error) {
	userID, _ := helpers.ExtractUserID(ctx)

	return api.GetUsersCheckSignedIn200JSONResponse{
		IsSignedIn: uh.userService.ExistsUser(userID),
	}, nil
}
