import { type Page } from "@playwright/test";

export async function gotoPage(page: Page, url: string) {
  await page.goto(url);
  await page.locator("h1").waitFor({ state: "visible" });
}

export async function selectOption(page: Page, testId: string, option: string) {
  await page.getByTestId(testId).locator("input:visible").click({ force: true });
  await page.getByRole("option", { name: option, exact: true }).click();
}
