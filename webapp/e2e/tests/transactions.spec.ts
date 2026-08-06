import { test, expect } from "@playwright/test";

test.describe("取引一覧ページ", () => {
	test("取引一覧ページが正常に表示され、実行時エラーが発生しないこと", async ({
		page,
	}) => {
		const errors: string[] = [];

		// ページ内で発生する未キャッチ例外を収集
		page.on("pageerror", (error) => {
			errors.push(
				`${error.name}: ${error.message}${error.stack ? `\n${error.stack}` : ""}`,
			);
		});

		const response = await page.goto("/o/sample-party/2026/transactions");

		expect(response, "page.goto() が失敗しました").not.toBeNull();
		expect(response!.status()).toBe(200);
		await expect(page).toHaveTitle(/全ての出入金.*みらいまる見え政治資金/);

		// 取引一覧の見出しが描画されるまで待機（networkidle依存を避ける）
		await expect(
			page.getByRole("heading", { name: /すべての出入金|全ての出入金/ }),
		).toBeVisible();
		// 取引一覧テーブルが描画されるまで待機
		await expect(
			page.locator('table[aria-label="政治資金取引一覧表"]'),
		).toBeVisible();

		// 実行時エラーが発生していないことを確認
		expect(
			errors,
			`以下のエラーが発生しました:\n${errors.join("\n")}`,
		).toHaveLength(0);
	});

	test("デスクトップの列見出しが現在のソート状態を公開すること", async ({ page }) => {
		await page.goto("/o/sample-party/2026/transactions");

		const table = page.getByRole("table", { name: "政治資金取引一覧表" });
		const dateSortButton = table.getByRole("button", { name: "日付順でソート" });
		const amountSortButton = table.getByRole("button", { name: "金額順でソート" });
		const dateHeader = dateSortButton.locator("xpath=ancestor::th");
		const amountHeader = amountSortButton.locator("xpath=ancestor::th");

		await expect(table.locator("th[aria-sort]")).toHaveCount(1);
		await expect(dateHeader).toHaveAttribute("aria-sort", "descending");
		expect(await amountHeader.getAttribute("aria-sort")).toBeNull();
		expect(await dateSortButton.getAttribute("aria-describedby")).toBeNull();
		expect(await amountSortButton.getAttribute("aria-describedby")).toBeNull();
		await expect(dateSortButton.locator("img")).toHaveAttribute("alt", "");
		await expect(amountSortButton.locator("img")).toHaveAttribute("alt", "");

		await dateSortButton.click();
		await expect(page).toHaveURL(/sort=date.*order=asc/);
		await expect(dateHeader).toHaveAttribute("aria-sort", "ascending");

		await amountSortButton.click();
		await expect(page).toHaveURL(/sort=amount.*order=desc/);
		await expect(table.locator("th[aria-sort]")).toHaveCount(1);
		expect(await dateHeader.getAttribute("aria-sort")).toBeNull();
		await expect(amountHeader).toHaveAttribute("aria-sort", "descending");

		await amountSortButton.click();
		await expect(page).toHaveURL(/sort=amount.*order=asc/);
		await expect(amountHeader).toHaveAttribute("aria-sort", "ascending");
	});

	test("モバイルの並び順ボタンが選択状態を公開すること", async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto("/o/sample-party/2026/transactions");

		const sortGroup = page.getByRole("group", { name: "並び順" });
		const newestButton = sortGroup.getByRole("button", { name: "新しい順" });
		const oldestButton = sortGroup.getByRole("button", { name: "古い順" });

		await expect(sortGroup.locator('button[aria-pressed="true"]')).toHaveCount(1);
		await expect(newestButton).toHaveAttribute("aria-pressed", "true");
		await expect(oldestButton).toHaveAttribute("aria-pressed", "false");

		await oldestButton.click();
		await expect(page).toHaveURL(/sort=date.*order=asc/);
		await expect(sortGroup.locator('button[aria-pressed="true"]')).toHaveCount(1);
		await expect(newestButton).toHaveAttribute("aria-pressed", "false");
		await expect(oldestButton).toHaveAttribute("aria-pressed", "true");
	});
});
