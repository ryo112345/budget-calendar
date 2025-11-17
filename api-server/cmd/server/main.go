package main

import (
	"net/http"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	api "github.com/yamao/budget-calendar/apis"
	"github.com/yamao/budget-calendar/database"
	"github.com/yamao/budget-calendar/internal/handlers"
	"github.com/yamao/budget-calendar/internal/services"
)

func main() {
	godotenv.Load()

	database.Init()

	e := echo.New()

	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{
			"status": "ok",
		})
	})

	categoryService := services.NewCategoryService(database.DB)
	categoryHandler := handlers.NewCategoriesHandler(categoryService)

	// OpenAPI仕様に基づいたルーティングを登録
	api.RegisterHandlers(e, categoryHandler)

	e.Logger.Fatal(e.Start(":8080"))
}
