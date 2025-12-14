package services

import (
	"errors"
	"fmt"
	"os"
	"time"

	api "apps/apis"
	"apps/internal/models"
	"apps/internal/validators"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var (
	ErrEmailAlreadyExists   = errors.New("email already exists")
	ErrAuthenticationFailed = errors.New("authentication failed")
)

type UserService interface {
	SignUp(input *api.UserSignUpInput) error
	SignIn(input *api.UserSignInInput) (string, error)
	ExistsUser(id uint) bool
}

type userService struct {
	db *gorm.DB
}

func NewUserService(db *gorm.DB) UserService {
	return &userService{db: db}
}

// SignUp - 会員登録
func (us *userService) SignUp(input *api.UserSignUpInput) error {
	// バリデーション
	if err := validators.ValidateSignUp(input); err != nil {
		return err
	}

	var count int64
	if err := us.db.Model(&models.User{}).Where("email = ?", input.Email).Count(&count).Error; err != nil {
		return err
	}
	if count > 0 {
		return ErrEmailAlreadyExists
	}

	hashedPassword, err := us.encryptPassword(input.Password)
	if err != nil {
		return err
	}

	user := models.User{
		Name:     input.Name,
		Email:    input.Email,
		Password: hashedPassword,
	}

	if err := us.db.Create(&user).Error; err != nil {
		return err
	}

	return nil
}

// SignIn - ログイン
func (us *userService) SignIn(input *api.UserSignInInput) (string, error) {
	// バリデーション
	if err := validators.ValidateSignIn(input); err != nil {
		return "", err
	}

	var user models.User
	if err := us.db.Where("email = ?", input.Email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
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
	var count int64
	us.db.Model(&models.User{}).Where("id = ?", id).Count(&count)
	return count > 0
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
