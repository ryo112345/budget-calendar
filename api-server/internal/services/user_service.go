package services

import (
	"errors"
	"fmt"
	"os"
	"time"

	api "apps/apis"
	"apps/internal/models"
	"apps/internal/repositories"
	"apps/internal/validators"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	SignUp(input *api.UserSignUpInput) (string, error)
	SignIn(input *api.UserSignInInput) (string, error)
	ExistsUser(id uint) bool
}

type userService struct {
	repo repositories.UserRepository
}

func NewUserService(repo repositories.UserRepository) UserService {
	return &userService{repo: repo}
}

// SignUp - 会員登録
func (us *userService) SignUp(input *api.UserSignUpInput) (string, error) {
	// バリデーション
	if err := validators.ValidateSignUp(input); err != nil {
		return "", err
	}

	exists, err := us.repo.ExistsByEmail(input.Email)
	if err != nil {
		return "", err
	}
	if exists {
		return "", ErrEmailAlreadyExists
	}

	hashedPassword, err := us.encryptPassword(input.Password)
	if err != nil {
		return "", err
	}

	user := models.User{
		Name:     input.Name,
		Email:    input.Email,
		Password: hashedPassword,
	}

	if err := us.repo.Create(&user); err != nil {
		return "", err
	}

	// トークン生成
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_TOKEN_KEY")))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// SignIn - ログイン
func (us *userService) SignIn(input *api.UserSignInInput) (string, error) {
	// バリデーション
	if err := validators.ValidateSignIn(input); err != nil {
		return "", err
	}

	user, err := us.repo.FindByEmail(input.Email)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return "", ErrAuthenticationFailed
		}
		return "", err
	}

	if err := us.compareHashPassword(user.Password, input.Password); err != nil {
		return "", ErrAuthenticationFailed
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_TOKEN_KEY")))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func (us *userService) ExistsUser(id uint) bool {
	exists, _ := us.repo.ExistsByID(id)
	return exists
}

func (us *userService) encryptPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("パスワードのハッシュ化に失敗しました: %w", err)
	}
	return string(hash), nil
}

func (us *userService) compareHashPassword(hashedPassword, requestPassword string) error {
	if err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(requestPassword)); err != nil {
		return err
	}
	return nil
}
