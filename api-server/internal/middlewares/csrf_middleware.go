package middlewares

import (
	"context"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

// CsrfContextMiddleware は、EchoのCSRFミドルウェアが設定したトークンを
// 標準のcontext.Contextに移し替える。StrictHandlerではecho.Contextにアクセスできないため、
// ハンドラー内でCSRFトークンを取得可能にする。
func CsrfContextMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		token, ok := c.Get(middleware.DefaultCSRFConfig.ContextKey).(string)
		if !ok {
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to retrieve CSRF token")
		}

		//lint:ignore SA1029 CSRFトークンの受け渡しに文字列キーが必要
		ctx := context.WithValue(c.Request().Context(), middleware.DefaultCSRFConfig.ContextKey, token)
		c.SetRequest(c.Request().WithContext(ctx))

		return next(c)
	}
}
