// CSRFトークンを保持するシンプルなストレージ
// 認証状態（isSignedIn）は含まない
let csrfToken: string | null = null;

export function getCsrfToken(): string | null {
  return csrfToken;
}

export function setCsrfToken(token: string): void {
  csrfToken = token;
}
