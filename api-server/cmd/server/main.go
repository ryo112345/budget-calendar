package main

import (
	"net/http"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/yamao/budget-calendar/database"
)

func main() {
	// 環境変数の読み込み
	godotenv.Load()

	// データベース接続
	database.Init()

	e := echo.New()

	// ヘルスチェック用のエンドポイント
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{
			"status": "ok",
		})
	})

	// サーバー起動
	e.Logger.Fatal(e.Start(":8080"))
}
