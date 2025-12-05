package handlers

import (
	api "apps/apis"
	"context"

	"github.com/labstack/echo/v4/middleware"
)

type CsrfHandler interface {
	GetCsrf(ctx context.Context, request api.GetCsrfRequestObject) (api.GetCsrfResponseObject, error)
}

type csrfHandler struct{}

func NewCsrfHandler() CsrfHandler {
	return &csrfHandler{}
}

func (ch *csrfHandler) GetCsrf(ctx context.Context, request api.GetCsrfRequestObject) (api.GetCsrfResponseObject, error) {
	csrfToken, ok := ctx.Value(middleware.DefaultCSRFConfig.ContextKey).(string)
	if !ok {
		return api.GetCsrf500ApplicationProblemPlusJSONResponse{
			Type:   "https://example.com/errors/csrf-token-error",
			Title:  "CSRF Token Error",
			Status: 500,
			Detail: "CSRFトークンの取得に失敗しました",
		}, nil
	}

	return api.GetCsrf200JSONResponse{
		CsrfToken: csrfToken,
	}, nil
}
