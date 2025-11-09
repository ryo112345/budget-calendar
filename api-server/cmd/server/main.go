package main

import (
	"net/http"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
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

	e.GET("/categories", categoryHandler.FetchList)
	e.GET("/categories/:id", categoryHandler.FetchDetail)
	e.POST("/categories", categoryHandler.Create)
	e.PUT("/categories/:id", categoryHandler.Update)
	e.DELETE("/categories/:id", categoryHandler.Delete)

	e.Logger.Fatal(e.Start(":8080"))
}
