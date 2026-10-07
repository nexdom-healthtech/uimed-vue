import { gotoPage, selectOption } from "@e2e/utils.ts";
import { test, expect, type Locator, type Page } from "@playwright/test";

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

  test.describe("alignY", () => {
    test("aligns the columns to the top with start", async ({ page }) => {
      const row = page.getByTestId("demo-layout-align-y-start");
      await expect(row).toHaveCSS("align-items", "flex-start");

      const boxes = await getColumnBoxes(row);
      expectSameValue(boxes.map((box) => box.y));
      expectDifferentHeights(boxes);
    });

    test("centers the columns vertically with center", async ({ page }) => {
      const row = page.getByTestId("demo-layout-align-y-center");
      await expect(row).toHaveCSS("align-items", "center");

      const boxes = await getColumnBoxes(row);
      expectSameValue(boxes.map((box) => box.y + box.height / 2));
      expectDifferentHeights(boxes);
    });

    test("aligns the columns to the bottom with end", async ({ page }) => {
      const row = page.getByTestId("demo-layout-align-y-end");
      await expect(row).toHaveCSS("align-items", "flex-end");

      const boxes = await getColumnBoxes(row);
      expectSameValue(boxes.map((box) => box.y + box.height));
      expectDifferentHeights(boxes);
    });

    test("stretches the columns to the tallest one with stretch", async ({ page }) => {
      const row = page.getByTestId("demo-layout-align-y-stretch");
      await expect(row).toHaveCSS("align-items", "stretch");

      const boxes = await getColumnBoxes(row);
      expectSameValue(boxes.map((box) => box.y));
      expectSameValue(boxes.map((box) => box.height));
    });
  });

  test.describe("alignX", () => {
    for (const [alignX, justifyContent] of [
      ["start", "flex-start"],
      ["center", "center"],
      ["end", "flex-end"],
    ] as const) {
      test(`aligns the column to the ${alignX} of the line with ${alignX}`, async ({ page }) => {
        const row = page.getByTestId(`demo-layout-align-x-${alignX}`);
        await expect(row).toHaveCSS("justify-content", justifyContent);

        const rowBox = await getBox(row);
        const columnBoxes = await getColumnBoxes(row, 1);
        expect(columnBoxes[0].width).toBeLessThan(rowBox.width / 2);
        expectAlignedX(rowBox, columnBoxes, alignX);
      });
    }

    test("makes the auto column take the whole line below the sm breakpoint", async ({ page }) => {
      await page.setViewportSize({ width: 599, height: 800 });
      const row = page.getByTestId("demo-layout-align-x-center");

      const rowBox = await getBox(row);
      const [columnBox] = await getColumnBoxes(row, 1);
      expectSameValue([columnBox.x, rowBox.x]);
      expectSameValue([columnBox.width, rowBox.width]);
    });
  });

  test.describe("fullHeight", () => {
    test("fills the visible content area below the app bar", async ({ page }) => {
      const row = page.getByTestId("demo-layout-full-height");
      await expect(row).toHaveCSS("align-content", "center");

      const { rowHeight, availableHeight } = await row.evaluate((element) => {
        const container = element.parentElement as HTMLElement;
        const appBar = element.closest(".v-application")?.querySelector("header") as HTMLElement;
        const style = getComputedStyle(container);
        return {
          rowHeight: element.getBoundingClientRect().height,
          availableHeight:
            window.innerHeight -
            appBar.getBoundingClientRect().height -
            parseFloat(style.paddingTop) -
            parseFloat(style.paddingBottom),
        };
      });
      expectSameValue([rowHeight, availableHeight]);
    });

    test("centers the column in both axes", async ({ page }) => {
      const row = page.getByTestId("demo-layout-full-height");
      const rowBox = await getBox(row);
      const [columnBox] = await getColumnBoxes(row, 1);

      expect(columnBox.height).toBeLessThan(rowBox.height / 2);
      expectSameValue([columnBox.y + columnBox.height / 2, rowBox.y + rowBox.height / 2]);
      expectAlignedX(rowBox, [columnBox], "center");
    });

    test("keeps the column centered vertically below the sm breakpoint", async ({ page }) => {
      await page.setViewportSize({ width: 599, height: 800 });
      const row = page.getByTestId("demo-layout-full-height");
      const rowBox = await getBox(row);
      const [columnBox] = await getColumnBoxes(row, 1);

      expectSameValue([columnBox.width, rowBox.width]);
      expectSameValue([columnBox.y + columnBox.height / 2, rowBox.y + rowBox.height / 2]);
    });
  });

  test.describe("playground", () => {
    test("aligns the columns to the top and to the start by default", async ({ page }) => {
      const preview = page.getByTestId("layout-preview");
      await expect(preview).toHaveCSS("align-items", "flex-start");
      await expect(preview).toHaveCSS("justify-content", "flex-start");
      expectAlignedX(await getBox(preview), await getColumnBoxes(preview), "start");
    });

    test("updates the vertical alignment when playground-align-y changes", async ({ page }) => {
      const preview = page.getByTestId("layout-preview");

      for (const [alignY, alignItems] of [
        ["center", "center"],
        ["end", "flex-end"],
        ["stretch", "stretch"],
        ["start", "flex-start"],
      ] as const) {
        await selectPlaygroundOption(page, "layout-playground-align-y", alignY);
        await expect(preview).toHaveCSS("align-items", alignItems);
      }
    });

    test("updates the horizontal alignment when playground-align-x changes", async ({ page }) => {
      const preview = page.getByTestId("layout-preview");

      for (const [alignX, justifyContent] of [
        ["center", "center"],
        ["end", "flex-end"],
        ["start", "flex-start"],
      ] as const) {
        await selectPlaygroundOption(page, "layout-playground-align-x", alignX);
        await expect(preview).toHaveCSS("justify-content", justifyContent);
        expectAlignedX(await getBox(preview), await getColumnBoxes(preview), alignX);
      }
    });
  });

  test.describe("UI consistency", () => {
    test("matches last screenshot", async ({ page }) => {
      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  });
});

// The playground controls sit near the end of the page, so selecting an option scrolls the page
// and can leave the next control under the fixed navigation bar, where the click doesn't reach it.
// Centering the control first keeps it and its options in view, and waiting for the options to
// close keeps the next selection from opening the menu while it's still closing.
async function selectPlaygroundOption(page: Page, testId: string, option: string) {
  await page.getByTestId(testId).evaluate((control) => control.scrollIntoView({ block: "center" }));
  await selectOption(page, testId, option);
  await expect(page.getByRole("option", { name: option, exact: true })).toBeHidden();
}

type Box = { x: number; y: number; width: number; height: number };

async function getBox(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error("The element should be visible");
  return box;
}

async function getColumnBoxes(row: Locator, count = 3) {
  const columns = await row.locator(":scope > *").all();
  expect(columns).toHaveLength(count);

  return Promise.all(columns.map(getBox));
}

function expectAlignedX(rowBox: Box, columnBoxes: Box[], alignX: "start" | "center" | "end") {
  const startGap = Math.min(...columnBoxes.map((box) => box.x)) - rowBox.x;
  const endGap = rowBox.x + rowBox.width - Math.max(...columnBoxes.map((box) => box.x + box.width));

  if (alignX === "start") {
    expectSameValue([startGap, 0]);
    expect(endGap).toBeGreaterThan(1);
  } else if (alignX === "end") {
    expectSameValue([endGap, 0]);
    expect(startGap).toBeGreaterThan(1);
  } else {
    expectSameValue([startGap, endGap]);
    expect(startGap).toBeGreaterThan(1);
  }
}

function expectSameValue(values: number[]) {
  expect(Math.max(...values) - Math.min(...values)).toBeLessThan(1);
}

function expectDifferentHeights(boxes: { height: number }[]) {
  expect(new Set(boxes.map((box) => Math.round(box.height))).size).toBe(boxes.length);
}
