import { gotoPage } from "@e2e/utils.ts";
import { test, expect } from "@playwright/test";

test.describe("layout", () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, "guide/components/layout");
  });

  test.describe("list", () => {
    test("renders the row as a list of columns without bullets", async ({ page }) => {
      const list = page.getByTestId("demo-layout-list");
      const listItems = list.getByRole("listitem");

      await expect(list).toHaveJSProperty("tagName", "UL");
      await expect(list).toHaveRole("list");
      await expect(listItems).toHaveCount(3);
      await expect(listItems).toHaveText(["Cardiologia", "Dermatologia", "Pediatria"]);
      await expect(list).toHaveCSS("padding-left", "0px");
      for (const listItem of await listItems.all()) {
        await expect(listItem).toHaveJSProperty("tagName", "LI");
        await expect(listItem).toHaveCSS("display", "block");
      }
    });

    test("keeps the columns side by side", async ({ page }) => {
      const boxes = await Promise.all(
        (await page.getByTestId("demo-layout-list").getByRole("listitem").all()).map((item) =>
          item.boundingBox(),
        ),
      );
      expect(new Set(boxes.map((box) => box?.y)).size).toBe(1);
      expect(new Set(boxes.map((box) => box?.width)).size).toBe(1);
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshot", async ({ page }) => {
      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
});
