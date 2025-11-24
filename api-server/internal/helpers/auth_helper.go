package helpers

import "context"

type key string

const (
	ctxUserIDKey key = "UserID"
)

// NewWithUserIDContext - ContextにユーザーIDを設定
func NewWithUserIDContext(ctx context.Context, userID uint) context.Context {
	return context.WithValue(ctx, ctxUserIDKey, userID)
}

// ExtractUserID - ContextからユーザーIDを取得
func ExtractUserID(ctx context.Context) (uint, bool) {
	v, ok := ctx.Value(ctxUserIDKey).(uint)
	return v, ok
}
