package middlewares

import (
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func Register(e *echo.Echo) {
	// NOTE: CORSの設定
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{os.Getenv("CLIENT_ORIGIN")},
		AllowMethods:     []string{http.MethodGet, http.MethodPatch, http.MethodPost, http.MethodDelete},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAccessControlAllowHeaders, echo.HeaderXCSRFToken, echo.HeaderAccessControlAllowCredentials, echo.HeaderAccessControlAllowOrigin},
		AllowCredentials: true,
	}))

	// NOTE: CSRF対策
	//       CSRFトークンはHTTPヘッダーで送信し、Cookieはサーバー側で検証に使用
	//       HttpOnlyはtrueにしてXSS攻撃からトークンを保護
	csrfConfig := middleware.CSRFConfig{
		TokenLookup:    "header:" + echo.HeaderXCSRFToken,
		CookieMaxAge:   3600,
		CookieSameSite: http.SameSiteNoneMode,
		CookieHTTPOnly: true,
		CookiePath:     "/",
		CookieSecure:   os.Getenv("APP_ENV") == "production",
		ErrorHandler: func(err error, c echo.Context) error {
			return echo.NewHTTPError(http.StatusForbidden, err.Error())
		},
	}
	e.Use(middleware.CSRFWithConfig(csrfConfig))

	// NOTE: CSRFトークンをcontext.Contextに埋め込むミドルウェアを適用
	// 	   : StrictHandlerだとecho.Contextがhandler側で使えずのため
	e.Use(CsrfContextMiddleware)

	// NOTE: Panicが発生してもサーバを停止することを防ぐ
	e.Use(middleware.Recover())
}
