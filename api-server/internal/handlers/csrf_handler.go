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
		return api.GetCsrf500JSONResponse{
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

	return api.GetCsrf200JSONResponse{
		CsrfToken: csrfToken,
	}, nil
}
