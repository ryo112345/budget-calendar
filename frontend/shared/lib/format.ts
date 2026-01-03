/**
 * 数値をカンマ区切りの文字列にフォーマット
 */
export function formatNumberWithCommas(value: string | number): string {
  const num = typeof value === "string" ? value.replace(/,/g, "") : String(value);
  if (!num || isNaN(Number(num))) return "";
  return Number(num).toLocaleString("ja-JP");
}

/**
 * カンマ区切りの文字列から数値文字列に変換
 */
export function parseFormattedNumber(value: string): string {
  return value.replace(/,/g, "");
}
