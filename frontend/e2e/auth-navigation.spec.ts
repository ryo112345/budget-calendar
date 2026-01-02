import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173";

test.describe("認証状態によるナビゲーション表示テスト", () => {
  test("未ログイン時はログイン/会員登録リンクがヘッダーに表示される", async ({ page }) => {
    await page.goto(BASE_URL);

    // ヘッダー内にログイン・会員登録リンクが表示される
    const header = page.locator("header");
    await expect(header.getByRole("link", { name: "ログイン" })).toBeVisible();
    await expect(header.getByRole("link", { name: "会員登録" })).toBeVisible();

    // ログイン後のナビゲーションは表示されない
    await expect(header.getByRole("link", { name: "カレンダー" })).not.toBeVisible();
    await expect(header.getByRole("link", { name: "取引" })).not.toBeVisible();
    await expect(header.getByRole("link", { name: "設定" })).not.toBeVisible();
  });

  test("ログイン後はナビゲーションが切り替わる", async ({ page }) => {
    // ユニークなメールアドレスを生成
    const uniqueEmail = `test-${Date.now()}@example.com`;

    // まず会員登録
    await page.goto(`${BASE_URL}/sign-up`);
    await page.getByLabel("ユーザ名").fill("テストユーザー");
    await page.getByLabel("Email").fill(uniqueEmail);
    await page.getByLabel("パスワード").fill("Password123");
    await page.getByRole("button", { name: "登録する" }).click();

    // ログインページにリダイレクトされる
    await expect(page).toHaveURL(/sign-in/, { timeout: 10000 });

    // ログイン
    await page.getByLabel("Email").fill(uniqueEmail);
    await page.getByLabel("パスワード").fill("Password123");
    await page.getByRole("button", { name: "ログインする" }).click();

    // カレンダーページにリダイレクトされる
    await expect(page).toHaveURL(/calendar/);

    // ヘッダーにナビゲーションが表示される（PC用）
    const header = page.locator("header");
    await expect(header.getByRole("link", { name: "カレンダー" })).toBeVisible();
    await expect(header.getByRole("link", { name: "取引" })).toBeVisible();
    await expect(header.getByRole("link", { name: "設定" })).toBeVisible();

    // ログイン・会員登録リンクは表示されない
    await expect(header.getByRole("link", { name: "ログイン" })).not.toBeVisible();
    await expect(header.getByRole("link", { name: "会員登録" })).not.toBeVisible();
  });

  test("ログアウト後はログイン/会員登録リンクに戻る", async ({ page }) => {
    // ユニークなメールアドレスを生成
    const uniqueEmail = `test-logout-${Date.now()}@example.com`;

    // 会員登録
    await page.goto(`${BASE_URL}/sign-up`);
    await page.getByLabel("ユーザ名").fill("テストユーザー");
    await page.getByLabel("Email").fill(uniqueEmail);
    await page.getByLabel("パスワード").fill("Password123");
    await page.getByRole("button", { name: "登録する" }).click();

    // ログイン
    await expect(page).toHaveURL(/sign-in/);
    await page.getByLabel("Email").fill(uniqueEmail);
    await page.getByLabel("パスワード").fill("Password123");
    await page.getByRole("button", { name: "ログインする" }).click();

    // カレンダーページにリダイレクトされる
    await expect(page).toHaveURL(/calendar/);

    // 設定ページに移動してログアウト
    await page.locator("header").getByRole("link", { name: "設定" }).click();
    await expect(page).toHaveURL(/settings/);

    // confirmダイアログを自動でOKする
    page.on("dialog", (dialog) => dialog.accept());

    // ログアウトボタンをクリック
    await page.getByRole("button", { name: "ログアウト" }).click();

    // ログインページにリダイレクトされる
    await expect(page).toHaveURL(/sign-in/, { timeout: 10000 });

    // ヘッダーにログイン・会員登録リンクが表示される
    const header = page.locator("header");
    await expect(header.getByRole("link", { name: "ログイン" })).toBeVisible();
    await expect(header.getByRole("link", { name: "会員登録" })).toBeVisible();

    // ログイン後のナビゲーションは表示されない
    await expect(header.getByRole("link", { name: "カレンダー" })).not.toBeVisible();
  });
});
