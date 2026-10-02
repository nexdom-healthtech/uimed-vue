import { gotoPage, selectOption } from "@e2e/utils.ts";
import { test, expect, type Locator } from "@playwright/test";

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

  test.describe("align", () => {
    test("aligns the columns to the top with start", async ({ page }) => {
      const row = page.getByTestId("demo-layout-align-start");
      await expect(row).toHaveCSS("align-items", "flex-start");

      const boxes = await getColumnBoxes(row);
      expectSameValue(boxes.map((box) => box.y));
      expectDifferentHeights(boxes);
    });

    test("centers the columns vertically with center", async ({ page }) => {
      const row = page.getByTestId("demo-layout-align-center");
      await expect(row).toHaveCSS("align-items", "center");

      const boxes = await getColumnBoxes(row);
      expectSameValue(boxes.map((box) => box.y + box.height / 2));
      expectDifferentHeights(boxes);
    });

    test("aligns the columns to the bottom with end", async ({ page }) => {
      const row = page.getByTestId("demo-layout-align-end");
      await expect(row).toHaveCSS("align-items", "flex-end");

      const boxes = await getColumnBoxes(row);
      expectSameValue(boxes.map((box) => box.y + box.height));
      expectDifferentHeights(boxes);
    });

    test("stretches the columns to the tallest one with stretch", async ({ page }) => {
      const row = page.getByTestId("demo-layout-align-stretch");
      await expect(row).toHaveCSS("align-items", "stretch");

      const boxes = await getColumnBoxes(row);
      expectSameValue(boxes.map((box) => box.y));
      expectSameValue(boxes.map((box) => box.height));
    });
  });

  test.describe("playground", () => {
    test("aligns the columns to the top by default", async ({ page }) => {
      await expect(page.getByTestId("layout-preview")).toHaveCSS("align-items", "flex-start");
    });

    test("updates the alignment when playground-align changes", async ({ page }) => {
      const preview = page.getByTestId("layout-preview");

      for (const [align, alignItems] of [
        ["center", "center"],
        ["end", "flex-end"],
        ["stretch", "stretch"],
        ["start", "flex-start"],
      ] as const) {
        await selectOption(page, "layout-playground-align", align);
        await expect(preview).toHaveCSS("align-items", alignItems);
      }
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshot", async ({ page }) => {
      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
});

async function getColumnBoxes(row: Locator) {
  const columns = await row.locator(":scope > *").all();
  expect(columns).toHaveLength(3);

  return Promise.all(
    columns.map(async (column) => {
      const box = await column.boundingBox();
      if (!box) throw new Error("The column should be visible");
      return box;
    }),
  );
}

function expectSameValue(values: number[]) {
  expect(Math.max(...values) - Math.min(...values)).toBeLessThan(1);
}

function expectDifferentHeights(boxes: { height: number }[]) {
  expect(new Set(boxes.map((box) => Math.round(box.height))).size).toBe(boxes.length);
}
