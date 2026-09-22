import { VSkeletonLoader, VTable } from "vuetify/components";
import { mount } from "@vue/test-utils";
import Table from "@/components/table/table.vue";
import type { TableProps } from "@/components/table/types.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

const testId = "table-test-id";
const styleValue = "random-style";
const classValue = "random-class";

describe("Table", () => {
  it("should exist", () => {
    const wrapper = mountTable();
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain primary component", () => {
    const wrapper = mountTable();
    expect(findVTable(wrapper).exists()).toBeTruthy();
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountTable();
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).toBeUndefined();
  });

  describe("props", () => {
    describe("headers", () => {
      it("should render one th per header with correct text when provided (non-vertical)", () => {
        const headers = ["Name", "Age", "City"];
        const wrapper = mountTable({ headers });

        const thead = wrapper.find("thead");
        const ths = thead.findAll("th");

        expect(ths).toHaveLength(3);
        expect(ths[0].text()).toBe("Name");
        expect(ths[1].text()).toBe("Age");
        expect(ths[2].text()).toBe("City");
      });

      it("should not render thead when headers is undefined (non-vertical)", () => {
        const wrapper = mountTable({ headers: undefined });
        expect(wrapper.find("thead").exists()).toBeFalsy();
      });

      it("should not render thead when headers is an empty array (non-vertical)", () => {
        const wrapper = mountTable({ headers: [] });
        expect(wrapper.find("thead").exists()).toBeFalsy();
      });

      it("should not render any th when vertical with headers (they go in tbody instead)", () => {
        const headers = ["Name", "Age"];
        const items = [["John", "12"]];
        const wrapper = mountTable({ headers, items, vertical: true });
        const thead = wrapper.find("thead");
        expect(thead.exists()).toBeFalsy();
      });
    });

    describe("items", () => {
      it("should render one tr per item with td matching each row values (non-vertical)", () => {
        const items = [
          ["John", "12"],
          ["Sarah", "25"],
        ];
        const wrapper = mountTable({ items });

        const tbodyRows = wrapper.findAll("tbody tr");

        expect(tbodyRows).toHaveLength(2);
        expect(tbodyRows[0].findAll("td")).toHaveLength(2);
        expect(tbodyRows[0].findAll("td")[0].text()).toBe("John");
        expect(tbodyRows[0].findAll("td")[1].text()).toBe("12");
        expect(tbodyRows[1].findAll("td")).toHaveLength(2);
        expect(tbodyRows[1].findAll("td")[0].text()).toBe("Sarah");
        expect(tbodyRows[1].findAll("td")[1].text()).toBe("25");
      });

      it("should render cells without padding or truncation when rows have different lengths", () => {
        const items = [
          ["John", "12", "All"],
          ["Sarah", "25"],
        ];
        const wrapper = mountTable({ items });

        const tbodyRows = wrapper.findAll("tbody tr");

        expect(tbodyRows[0].findAll("td")).toHaveLength(3);
        expect(tbodyRows[0].findAll("td")[0].text()).toBe("John");
        expect(tbodyRows[0].findAll("td")[1].text()).toBe("12");
        expect(tbodyRows[0].findAll("td")[2].text()).toBe("All");

        expect(tbodyRows[1].findAll("td")).toHaveLength(2);
      });

      it("should not render rows when items is undefined", () => {
        const wrapper = mountTable({ items: undefined });
        const tbodyRows = wrapper.findAll("tbody tr");
        expect(tbodyRows).toHaveLength(0);
      });

      it("should not render rows when items is empty", () => {
        const wrapper = mountTable({ items: [] });
        const tbodyRows = wrapper.findAll("tbody tr");
        expect(tbodyRows).toHaveLength(0);
      });

      it("should render rows with empty cells when items have empty strings", () => {
        const items = [
          ["John", ""],
          ["", "25"],
        ];
        const wrapper = mountTable({ items });

        const tbodyRows = wrapper.findAll("tbody tr");

        expect(tbodyRows[0].findAll("td")[0].text()).toBe("John");
        expect(tbodyRows[0].findAll("td")[1].text()).toBe("");
        expect(tbodyRows[1].findAll("td")[0].text()).toBe("");
        expect(tbodyRows[1].findAll("td")[1].text()).toBe("25");
      });
    });

    describe("vertical", () => {
      it("should default to falsy (horizontal layout)", () => {
        const headers = ["Name"];
        const items = [["John"]];
        const wrapper = mountTable({ headers, items });

        const thead = wrapper.find("thead");
        expect(thead.exists()).toBeTruthy();
      });

      it("should render N v-tables for N items when vertical with headers", () => {
        const headers = ["Name", "Age"];
        const items = [
          ["John", "12"],
          ["Sarah", "25"],
          ["T-800", "5"],
        ];
        const wrapper = mountTable({ headers, items, vertical: true });

        const tables = findAllVTables(wrapper);
        expect(tables).toHaveLength(3);
      });

      it("should render one tbody tr per header for each vertical table", () => {
        const headers = ["Name", "Age", "Movies"];
        const items = [
          ["John", "12", "All"],
          ["Sarah", "25", "First ones"],
        ];
        const wrapper = mountTable({ headers, items, vertical: true });

        const tables = findAllVTables(wrapper);
        expect(tables).toHaveLength(2);

        // First table (John's data)
        const firstTableRows = tables[0].findAll("tbody tr");
        expect(firstTableRows).toHaveLength(3);

        // Second table (Sarah's data)
        const secondTableRows = tables[1].findAll("tbody tr");
        expect(secondTableRows).toHaveLength(3);
      });

      it("should render each vertical table row with 1 th + 1 td", () => {
        const headers = ["Name", "Age"];
        const items = [["John", "12"]];
        const wrapper = mountTable({ headers, items, vertical: true });

        const table = findVTable(wrapper);
        const rows = table.findAll("tbody tr");

        rows.forEach((row) => {
          const ths = row.findAll("th");
          const tds = row.findAll("td");
          expect(ths).toHaveLength(1);
          expect(tds).toHaveLength(1);
        });
      });

      it("should render correct th labels and td values in vertical layout", () => {
        const headers = ["Name", "Age", "Movies"];
        const items = [
          ["John", "12", "All"],
          ["Sarah", "25", "First ones"],
        ];
        const wrapper = mountTable({ headers, items, vertical: true });

        const tables = findAllVTables(wrapper);

        // First item (John)
        const firstTableRows = tables[0].findAll("tbody tr");
        expect(firstTableRows[0].find("th").text()).toBe("Name");
        expect(firstTableRows[0].find("td").text()).toBe("John");
        expect(firstTableRows[1].find("th").text()).toBe("Age");
        expect(firstTableRows[1].find("td").text()).toBe("12");
        expect(firstTableRows[2].find("th").text()).toBe("Movies");
        expect(firstTableRows[2].find("td").text()).toBe("All");

        // Second item (Sarah)
        const secondTableRows = tables[1].findAll("tbody tr");
        expect(secondTableRows[0].find("th").text()).toBe("Name");
        expect(secondTableRows[0].find("td").text()).toBe("Sarah");
        expect(secondTableRows[1].find("th").text()).toBe("Age");
        expect(secondTableRows[1].find("td").text()).toBe("25");
        expect(secondTableRows[2].find("th").text()).toBe("Movies");
        expect(secondTableRows[2].find("td").text()).toBe("First ones");
      });

      it("should render vertical table with 1 th + 1 td even when values differ", () => {
        const headers = ["H1", "H2"];
        const items = [
          ["A", "B"],
          ["C", "D"],
        ];
        const wrapper = mountTable({ headers, items, vertical: true });

        const tables = findAllVTables(wrapper);
        tables.forEach((table) => {
          const rows = table.findAll("tbody tr");
          rows.forEach((row) => {
            expect(row.findAll("th")).toHaveLength(1);
            expect(row.findAll("td")).toHaveLength(1);
          });
        });
      });

      it("should render vertical layout without header labels when vertical is true but headers is empty", () => {
        const items = [
          ["John", "12"],
          ["Sarah", "25"],
        ];
        const wrapper = mountTable({ headers: [], items, vertical: true });

        const tables = findAllVTables(wrapper);
        expect(tables).toHaveLength(2);

        const firstTableRows = tables[0].findAll("tbody tr");
        expect(firstTableRows).toHaveLength(2);
        firstTableRows.forEach((row) => {
          expect(row.findAll("th")).toHaveLength(0);
          expect(row.findAll("td")).toHaveLength(1);
        });
        expect(firstTableRows[0].find("td").text()).toBe("John");
        expect(firstTableRows[1].find("td").text()).toBe("12");

        const secondTableRows = tables[1].findAll("tbody tr");
        expect(secondTableRows[0].find("td").text()).toBe("Sarah");
        expect(secondTableRows[1].find("td").text()).toBe("25");

        const thead = wrapper.find("thead");
        expect(thead.exists()).toBeFalsy();
      });

      it("should render zero tables when vertical with headers but items is empty", () => {
        const headers = ["Name", "Age"];
        const wrapper = mountTable({ headers, items: [], vertical: true, dataTestid: undefined });

        const tables = findAllVTables(wrapper);
        expect(tables).toHaveLength(0);
      });

      it("should render zero tables when vertical with headers but items is undefined", () => {
        const headers = ["Name", "Age"];
        const wrapper = mountTable({
          headers,
          items: undefined,
          vertical: true,
          dataTestid: undefined,
        });

        const tables = findAllVTables(wrapper);
        expect(tables).toHaveLength(0);
      });

      it("should render correctly with mixed empty cell values in vertical", () => {
        const headers = ["Col1", "Col2"];
        const items = [
          ["A", ""],
          ["", "D"],
        ];
        const wrapper = mountTable({ headers, items, vertical: true });

        const tables = findAllVTables(wrapper);
        expect(tables).toHaveLength(2);

        const firstTableRows = tables[0].findAll("tbody tr");
        expect(firstTableRows[0].find("th").text()).toBe("Col1");
        expect(firstTableRows[0].find("td").text()).toBe("A");
        expect(firstTableRows[1].find("th").text()).toBe("Col2");
        expect(firstTableRows[1].find("td").text()).toBe("");

        const secondTableRows = tables[1].findAll("tbody tr");
        expect(secondTableRows[0].find("th").text()).toBe("Col1");
        expect(secondTableRows[0].find("td").text()).toBe("");
        expect(secondTableRows[1].find("th").text()).toBe("Col2");
        expect(secondTableRows[1].find("td").text()).toBe("D");
      });
    });

    describe("loading", () => {
      it("should forward to v-skeleton-loader", async () => {
        const wrapper = mountTable();
        await wrapper.setProps({ loading: true });
        expect(findVSkeletonLoader(wrapper).props("loading")).toBe(true);
      });

      it("should be falsy by default", () => {
        const wrapper = mountTable();
        expect(findVSkeletonLoader(wrapper).props("loading")).toBeFalsy();
      });

      it("should have type according to the table content", async () => {
        const wrapper = mountTable();
        const vSkeletonLoader = findVSkeletonLoader(wrapper);
        expect(vSkeletonLoader.props("type")).toBe("table-tbody");

        await wrapper.setProps({ headers: ["Name"] });
        expect(vSkeletonLoader.props("type")).toBe("table-thead, table-tbody");

        await wrapper.setProps({ vertical: true });
        expect(vSkeletonLoader.props("type")).toBe("table-tbody");
      });

      it("should hide the v-table when loading is true", async () => {
        const wrapper = mountTable({ loading: false });
        expect(findVTable(wrapper).exists()).toBeTruthy();

        await wrapper.setProps({ loading: true });
        expect(findVSkeletonLoader(wrapper).props("loading")).toBe(true);
      });

      it("should show table again when loading is false", async () => {
        const wrapper = mountTable({ loading: true });
        await wrapper.setProps({ loading: false });
        expect(findVTable(wrapper).exists()).toBeTruthy();
      });
    });

    describe("dataTestid", () => {
      it("should forward to v-table in non-vertical mode", () => {
        const customTestId = "custom-table-id";
        const wrapper = mountTable({ dataTestid: customTestId });

        const vTable = findVTable(wrapper);
        expect(vTable.attributes("data-testid")).toBe(customTestId);
      });

      it("should not apply to skeleton loader", () => {
        const customTestId = "custom-table-id";
        const wrapper = mountTable({ dataTestid: customTestId });

        const vSkeletonLoader = findVSkeletonLoader(wrapper);
        expect(vSkeletonLoader.attributes("data-testid")).toBeUndefined();
      });

      it("should render unsuffixed data-testid when vertical with exactly 1 item", () => {
        const headers = ["Name"];
        const items = [["John"]];
        const wrapper = mountTable({ headers, items, vertical: true, dataTestid: testId });

        const table = findVTable(wrapper);
        expect(table.attributes("data-testid")).toBe(testId);
      });

      it("should render suffixed data-testid when vertical with multiple items", () => {
        const headers = ["Name"];
        const items = [["John"], ["Sarah"], ["T-800"]];
        const wrapper = mountTable({ headers, items, vertical: true, dataTestid: testId });

        const tables = findAllVTables(wrapper);
        expect(tables[0].attributes("data-testid")).toBe(`${testId}-0`);
        expect(tables[1].attributes("data-testid")).toBe(`${testId}-1`);
        expect(tables[2].attributes("data-testid")).toBe(`${testId}-2`);
      });

      it("should not set data-testid when vertical with multiple items but dataTestid undefined", () => {
        const headers = ["Name"];
        const items = [["John"], ["Sarah"]];
        const wrapper = mountTable({ headers, items, vertical: true, dataTestid: undefined });

        const tables = findAllVTables(wrapper);
        tables.forEach((table) => {
          expect(table.attributes("data-testid")).toBeUndefined();
        });
      });

      it("should not render literal 'undefined' string in data-testid", () => {
        const headers = ["Name"];
        const items = [["John"], ["Sarah"]];
        const wrapper = mountTable({ headers, items, vertical: true, dataTestid: undefined });

        const tables = findAllVTables(wrapper);
        tables.forEach((table) => {
          const testIdValue = table.attributes("data-testid");
          if (testIdValue !== undefined) {
            expect(testIdValue).not.toContain("undefined");
          }
        });
      });
    });
  });

  describe("combination scenarios", () => {
    it("should handle headers and items together in horizontal layout", () => {
      const headers = ["First", "Second"];
      const items = [
        ["A", "B"],
        ["C", "D"],
      ];
      const wrapper = mountTable({ headers, items });

      const thead = wrapper.find("thead");
      const ths = thead.findAll("th");
      expect(ths).toHaveLength(2);
      expect(ths[0].text()).toBe("First");
      expect(ths[1].text()).toBe("Second");

      const tbodyRows = wrapper.findAll("tbody tr");
      expect(tbodyRows).toHaveLength(2);
      expect(tbodyRows[0].findAll("td")[0].text()).toBe("A");
      expect(tbodyRows[0].findAll("td")[1].text()).toBe("B");
    });

    it("should handle headers, items, loading, and vertical together", async () => {
      const headers = ["H1", "H2"];
      const items = [["A", "B"]];
      const wrapper = mountTable({ headers, items, loading: false, vertical: true });

      // Start without loading to verify vertical layout works
      const tables = findAllVTables(wrapper);
      expect(tables).toHaveLength(1);

      // Now enable loading
      await wrapper.setProps({ loading: true });
      expect(findVSkeletonLoader(wrapper).props("loading")).toBe(true);
    });

    it("should handle data-testid with all other props in non-vertical", () => {
      const wrapper = mountTable({
        headers: ["Name"],
        items: [["John"]],
        loading: false,
        vertical: false,
        dataTestid: "full-test-id",
      });

      expect(findVTable(wrapper).attributes("data-testid")).toBe("full-test-id");
    });

    it("should handle data-testid with all other props in vertical with multiple items", () => {
      const wrapper = mountTable({
        headers: ["Name"],
        items: [["John"], ["Sarah"]],
        loading: false,
        vertical: true,
        dataTestid: "full-test-id",
      });

      const tables = findAllVTables(wrapper);
      expect(tables[0].attributes("data-testid")).toBe("full-test-id-0");
      expect(tables[1].attributes("data-testid")).toBe("full-test-id-1");
    });

    it("should render nothing when all props are undefined/empty", () => {
      const wrapper = mountTable({});

      const tables = findAllVTables(wrapper);
      expect(tables).toHaveLength(1);

      const tbody = wrapper.find("tbody");
      const rows = tbody.findAll("tr");
      expect(rows).toHaveLength(0);
    });

    it("should handle items only without headers in horizontal", () => {
      const items = [
        ["A", "B"],
        ["C", "D"],
      ];
      const wrapper = mountTable({ items });

      const thead = wrapper.find("thead");
      expect(thead.exists()).toBeFalsy();

      const tbody = wrapper.find("tbody");
      const rows = tbody.findAll("tr");
      expect(rows).toHaveLength(2);
    });
  });
});

function mountTable(props: Partial<TableProps> = {}, attrs: Record<string, unknown> = {}) {
  return mount(Table, {
    props: {
      dataTestid: testId,
      ...props,
    },
    attrs: {
      style: styleValue,
      class: classValue,
      ...attrs,
    },
    global: {
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
}

function findVTable(wrapper: ReturnType<typeof mountTable>) {
  return wrapper.findComponent(VTable);
}

function findAllVTables(wrapper: ReturnType<typeof mountTable>) {
  return wrapper.findAllComponents(VTable);
}

function findVSkeletonLoader(wrapper: ReturnType<typeof mountTable>) {
  return wrapper.findComponent(VSkeletonLoader);
}
