// APIエラークラス
export class ApiError extends Error {
  constructor(
    public status: number,
    public data: ErrorResponseData,
  ) {
    super(`API Error: ${status}`);
    this.name = "ApiError";
  }

  get details() {
    return this.data.error?.details?.[0];
  }

  get reason() {
    return this.details?.reason;
  }

  get metadata() {
    return this.details?.metadata;
  }
}

export type ErrorResponseData = {
  error?: {
    details?: Array<{
      reason?: string;
      metadata?: Record<string, string>;
    }>;
  };
};

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

const ERROR_MESSAGES: Record<string, string> = {
  // 認証関連
  EMAIL_ALREADY_EXISTS: "このメールアドレスは既に登録されています",
  INVALID_CREDENTIALS: "メールアドレスまたはパスワードが正しくありません",
  INVALID_EMAIL: "入力内容に誤りがあります",
  INVALID_PASSWORD: "入力内容に誤りがあります",

  // カテゴリ関連
  CATEGORY_NOT_FOUND: "カテゴリが見つかりません",
  CATEGORY_IN_USE: "このカテゴリは使用中のため削除できません",
  INVALID_CATEGORY_NAME: "入力内容に誤りがあります",
  INVALID_CATEGORY_COLOR: "入力内容に誤りがあります",

  // 取引関連
  TRANSACTION_NOT_FOUND: "取引が見つかりません",
  INVALID_TRANSACTION_TYPE: "入力内容に誤りがあります",
  INVALID_AMOUNT: "入力内容に誤りがあります",
  INVALID_DATE: "入力内容に誤りがあります",

  // 予算関連
  BUDGET_NOT_FOUND: "予算が見つかりません",
  BUDGET_ALREADY_EXISTS: "この月のこのカテゴリの予算は既に存在します",
  INVALID_MONTH: "入力内容に誤りがあります",
  INVALID_BUDGET_AMOUNT: "入力内容に誤りがあります",

  // 共通
  DATABASE_ERROR: "エラーが発生しました",
  UNKNOWN_ERROR: "エラーが発生しました",
  CONNECTION_ERROR: "接続に失敗しました。しばらくしてからお試しください",
};

export function getErrorMessage(reason?: string): string {
  return ERROR_MESSAGES[reason ?? ""] ?? "エラーが発生しました";
}
