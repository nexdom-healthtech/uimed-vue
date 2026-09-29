import {
  VDataIterator,
  VEmptyState,
  VList,
  VPagination,
  VSkeletonLoader,
} from "vuetify/components";
import { mount } from "@vue/test-utils";
import { h, toRaw } from "vue";
import DataSet from "@/components/data-sets/data-set/data-set.vue";
import TextField from "@/components/inputs/text-field/text-field.vue";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

type Patient = { id: number; name: string; plan: string };

const testId = "data-set-test-id";
const styleValue = "random-style";
const classValue = "random-class";
const defaultNoDataText = "Nenhum registro encontrado.";

const patients: Patient[] = [
  { id: 1, name: "Ana Souza", plan: "Ouro" },
  { id: 2, name: "Bruno Lima", plan: "Prata" },
  { id: 3, name: "Carla Dias", plan: "Bronze" },
];

describe("DataSet", () => {
  it("should exist", () => {
    const wrapper = mountDataSet();
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain primary component", () => {
    const wrapper = mountDataSet();
    expect(findVDataIterator(wrapper).exists()).toBeTruthy();
    expect(findVList(wrapper).exists()).toBeTruthy();
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountDataSet();
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).toBeUndefined();
  });

  describe("props", () => {
    describe("items", () => {
      it("should render the default slot once per item", () => {
        const wrapper = mountDataSet();
        expect(findRenderedItems(wrapper)).toHaveLength(3);
        expect(findRenderedItems(wrapper).map((item) => item.text())).toEqual([
          "0-Ana Souza",
          "1-Bruno Lima",
          "2-Carla Dias",
        ]);
      });

      it("should pass the original item to the default slot", () => {
        const received: Patient[] = [];
        mountDataSet(
          {},
          {
            default: ({ item }: { item: Patient }) => {
              received.push(item);
              return item.name;
            },
          },
        );
        expect(toRaw(received[0])).toBe(patients[0]);
        expect(toRaw(received[1])).toBe(patients[1]);
        expect(toRaw(received[2])).toBe(patients[2]);
      });

      it("should render items inside the v-list", () => {
        const wrapper = mountDataSet();
        expect(findVList(wrapper).findAll("[data-item]")).toHaveLength(3);
      });

      it("should forward items to v-data-iterator", () => {
        const wrapper = mountDataSet();
        expect(findVDataIterator(wrapper).props("items")).toEqual(patients);
      });

      it("should show the empty state when items is undefined", () => {
        const wrapper = mountDataSet({ items: undefined });
        expect(findRenderedItems(wrapper)).toHaveLength(0);
        expect(findVEmptyState(wrapper).exists()).toBeTruthy();
      });

      it("should show the empty state when items is empty", () => {
        const wrapper = mountDataSet({ items: [] });
        expect(findRenderedItems(wrapper)).toHaveLength(0);
        expect(findVEmptyState(wrapper).exists()).toBeTruthy();
      });

      it("should not show the empty state when there are items", () => {
        const wrapper = mountDataSet();
        expect(findVEmptyState(wrapper).exists()).toBeFalsy();
      });
    });

    describe("itemsPerPage", () => {
      it("should show up to 10 items per page by default", () => {
        const wrapper = mountDataSet({ items: createPatients(12) });
        expect(findVDataIterator(wrapper).props("itemsPerPage")).toBe(10);
        expect(findRenderedItems(wrapper)).toHaveLength(10);
      });

      it("should limit the number of items per page", () => {
        const wrapper = mountDataSet({ items: createPatients(5), itemsPerPage: 2 });
        expect(findVDataIterator(wrapper).props("itemsPerPage")).toBe(2);
        expect(findRenderedItems(wrapper).map((item) => item.text())).toEqual([
          "0-Patient 1",
          "1-Patient 2",
        ]);
      });

      it("should restart the index on each page", async () => {
        const wrapper = mountDataSet({ items: createPatients(5), itemsPerPage: 2 });
        await wrapper.setProps({ page: 2 });
        expect(findRenderedItems(wrapper).map((item) => item.text())).toEqual([
          "0-Patient 3",
          "1-Patient 4",
        ]);
      });
    });

    describe("page", () => {
      it("should start on the first page by default", () => {
        const wrapper = mountDataSet({ items: createPatients(5), itemsPerPage: 2 });
        expect(findVDataIterator(wrapper).props("page")).toBe(1);
        expect(findVPagination(wrapper).props("modelValue")).toBe(1);
      });

      it("should render the items of the given page", async () => {
        const wrapper = mountDataSet({ items: createPatients(5), itemsPerPage: 2 });
        await wrapper.setProps({ page: 3 });
        expect(findVPagination(wrapper).props("modelValue")).toBe(3);
        expect(findRenderedItems(wrapper).map((item) => item.text())).toEqual(["0-Patient 5"]);
      });

      it("should emit update:page when another page is selected", async () => {
        const wrapper = mountDataSet({ items: createPatients(5), itemsPerPage: 2 });
        findVPagination(wrapper).vm.$emit("update:modelValue", 2);
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted("update:page")).toEqual([[2]]);
        expect(findRenderedItems(wrapper).map((item) => item.text())).toEqual([
          "0-Patient 3",
          "1-Patient 4",
        ]);
      });

      it("should go to the next page when the next button is clicked", async () => {
        const wrapper = mountDataSet({ items: createPatients(5), itemsPerPage: 2 });
        await findVPagination(wrapper).find(".v-pagination__next button").trigger("click");

        expect(wrapper.emitted("update:page")).toEqual([[2]]);
        expect(findVPagination(wrapper).props("modelValue")).toBe(2);
      });

      it("should move to the last available page when items shrink", async () => {
        const wrapper = mountDataSet({ items: createPatients(5), itemsPerPage: 2, page: 3 });
        await wrapper.setProps({ items: createPatients(3) });

        expect(wrapper.emitted("update:page")).toEqual([[2]]);
        expect(findRenderedItems(wrapper).map((item) => item.text())).toEqual(["0-Patient 3"]);
      });
    });

    describe("pagination", () => {
      it("should render one page per chunk of items", () => {
        const wrapper = mountDataSet({ items: createPatients(5), itemsPerPage: 2 });
        expect(findVPagination(wrapper).props("length")).toBe(3);
      });

      it("should show every page button for a few pages", () => {
        const wrapper = mountDataSet({ items: createPatients(5), itemsPerPage: 2 });
        expect(findVPagination(wrapper).props("totalVisible")).toBe(3);
      });

      it("should let the page buttons fit the available width for many pages", () => {
        const wrapper = mountDataSet({ items: createPatients(12), itemsPerPage: 2 });
        expect(findVPagination(wrapper).props("length")).toBe(6);
        expect(findVPagination(wrapper).props("totalVisible")).toBeUndefined();
      });

      it("should not render page controls for a single page", () => {
        const wrapper = mountDataSet({ items: createPatients(2), itemsPerPage: 2 });
        expect(findVPagination(wrapper).exists()).toBeFalsy();
      });

      it("should not render page controls without items", () => {
        const wrapper = mountDataSet({ items: [] });
        expect(findVPagination(wrapper).exists()).toBeFalsy();
      });
    });

    describe("searchable", () => {
      it("should not render the search field by default", () => {
        const wrapper = mountDataSet();
        expect(findTextField(wrapper).exists()).toBeFalsy();
      });

      it("should render the search field when true", () => {
        const wrapper = mountDataSet({ searchable: true });
        const textField = findTextField(wrapper);
        expect(textField.exists()).toBeTruthy();
        expect(textField.props("type")).toBe("search");
        expect(textField.props("label")).toBe("Pesquisar");
      });

      it("should render the search field above the list", () => {
        const wrapper = mountDataSet({ searchable: true });
        const iteratorElement = findVDataIterator(wrapper).element;
        expect(iteratorElement.firstElementChild).toBe(findTextField(wrapper).element);
      });
    });

    describe("search", () => {
      it("should be empty by default", () => {
        const wrapper = mountDataSet({ searchable: true });
        expect(findTextField(wrapper).props("modelValue")).toBe("");
        expect(findVDataIterator(wrapper).props("search")).toBe("");
      });

      it("should filter items by any of their properties", async () => {
        const wrapper = mountDataSet();
        await wrapper.setProps({ search: "prata" });
        expect(findRenderedItems(wrapper).map((item) => item.text())).toEqual(["0-Bruno Lima"]);
      });

      it("should filter items typed in the search field", async () => {
        const wrapper = mountDataSet({ searchable: true });
        await findTextField(wrapper).find("input").setValue("carla");

        expect(wrapper.emitted("update:search")).toEqual([["carla"]]);
        expect(findRenderedItems(wrapper).map((item) => item.text())).toEqual(["0-Carla Dias"]);
      });

      it("should reflect the search on the search field", async () => {
        const wrapper = mountDataSet({ searchable: true });
        await wrapper.setProps({ search: "ana" });
        expect(findTextField(wrapper).props("modelValue")).toBe("ana");
      });

      it("should show every item again when the search is cleared", async () => {
        const wrapper = mountDataSet({ searchable: true, search: "ana" });
        await findTextField(wrapper).find("input").setValue("");
        expect(findRenderedItems(wrapper)).toHaveLength(3);
      });

      it("should go back to the first page when the search changes", async () => {
        const wrapper = mountDataSet({ items: createPatients(12), itemsPerPage: 2, page: 3 });
        await wrapper.setProps({ search: "Patient 1" });

        expect(wrapper.emitted("update:page")).toEqual([[1]]);
        expect(findRenderedItems(wrapper).map((item) => item.text())).toEqual([
          "0-Patient 1",
          "1-Patient 10",
        ]);
      });

      it("should go back to the first page when typing in the search field", async () => {
        const wrapper = mountDataSet({
          items: createPatients(12),
          itemsPerPage: 2,
          searchable: true,
        });
        await findVPagination(wrapper).find(".v-pagination__next button").trigger("click");
        await findVPagination(wrapper).find(".v-pagination__next button").trigger("click");
        expect(findVPagination(wrapper).props("modelValue")).toBe(3);

        await findTextField(wrapper).find("input").setValue("Patient 1");

        expect(wrapper.emitted("update:page")).toEqual([[2], [3], [1]]);
        expect(findVPagination(wrapper).props("modelValue")).toBe(1);
        expect(findRenderedItems(wrapper).map((item) => item.text())).toEqual([
          "0-Patient 1",
          "1-Patient 10",
        ]);
      });

      it("should show the empty state when no item matches", async () => {
        const wrapper = mountDataSet();
        await wrapper.setProps({ search: "nobody" });
        expect(findRenderedItems(wrapper)).toHaveLength(0);
        expect(findVEmptyState(wrapper).props("text")).toBe(defaultNoDataText);
      });
    });

    describe("searchKeys", () => {
      it("should search every property by default", () => {
        const wrapper = mountDataSet();
        expect(findVDataIterator(wrapper).props("filterKeys")).toBeUndefined();
      });

      it("should search every property when empty", async () => {
        const wrapper = mountDataSet({ searchKeys: [] });
        expect(findVDataIterator(wrapper).props("filterKeys")).toBeUndefined();

        await wrapper.setProps({ search: "bronze" });
        expect(findRenderedItems(wrapper).map((item) => item.text())).toEqual(["0-Carla Dias"]);
      });

      it("should restrict the search to the given properties", async () => {
        const wrapper = mountDataSet({ searchKeys: ["name"] });
        expect(findVDataIterator(wrapper).props("filterKeys")).toEqual(["name"]);

        await wrapper.setProps({ search: "bronze" });
        expect(findRenderedItems(wrapper)).toHaveLength(0);

        await wrapper.setProps({ search: "carla" });
        expect(findRenderedItems(wrapper).map((item) => item.text())).toEqual(["0-Carla Dias"]);
      });
    });

    describe("noDataText", () => {
      it('should default to "Nenhum registro encontrado."', () => {
        const wrapper = mountDataSet({ items: [] });
        expect(findVEmptyState(wrapper).props("text")).toBe(defaultNoDataText);
        expect(findVEmptyState(wrapper).text()).toBe(defaultNoDataText);
      });

      it("should render the given message", () => {
        const wrapper = mountDataSet({ items: [], noDataText: "Nenhum paciente." });
        expect(findVEmptyState(wrapper).text()).toBe("Nenhum paciente.");
      });
    });

    describe("loading", () => {
      it("should forward to v-skeleton-loader", async () => {
        const wrapper = mountDataSet();
        await wrapper.setProps({ loading: true });
        expect(findVSkeletonLoader(wrapper).props("loading")).toBe(true);
      });

      it("should be falsy by default", () => {
        const wrapper = mountDataSet();
        expect(findVSkeletonLoader(wrapper).props("loading")).toBeFalsy();
      });

      it('should use "list-item-two-line@3" skeleton type', () => {
        const wrapper = mountDataSet();
        expect(findVSkeletonLoader(wrapper).props("type")).toBe("list-item-two-line@3");
      });

      it("should make the skeleton occupy the full width", () => {
        const wrapper = mountDataSet();
        expect(findVSkeletonLoader(wrapper).props("width")).toBe("100%");
      });

      it("should hide the data set while loading", async () => {
        const wrapper = mountDataSet({ searchable: true });
        await wrapper.setProps({ loading: true });
        expect(findVDataIterator(wrapper).exists()).toBeFalsy();
        expect(findTextField(wrapper).exists()).toBeFalsy();
        expect(findRenderedItems(wrapper)).toHaveLength(0);
      });
    });

    describe("dataTestid", () => {
      it("should forward to the v-data-iterator", () => {
        const wrapper = mountDataSet();
        expect(findVDataIterator(wrapper).attributes("data-testid")).toBe(testId);
      });

      it("should not apply to the skeleton loader", () => {
        const wrapper = mountDataSet();
        expect(findVSkeletonLoader(wrapper).attributes("data-testid")).toBeUndefined();
      });

      it("should not set data-testid when undefined", () => {
        const wrapper = mountDataSet({ dataTestid: undefined });
        expect(findVDataIterator(wrapper).attributes("data-testid")).toBeUndefined();
      });
    });
  });
});

function createPatients(length: number): Patient[] {
  return Array.from({ length }, (_, index) => ({
    id: index + 1,
    name: `Patient ${index + 1}`,
    plan: "Ouro",
  }));
}

function renderItem({ item, index }: { item: Patient; index: number }) {
  return h("div", { "data-item": "" }, `${index}-${item.name}`);
}

function mountDataSet(
  props: Record<string, unknown> = {},
  slots: Record<string, unknown> = { default: renderItem },
) {
  return mount(DataSet, {
    props: {
      items: patients,
      dataTestid: testId,
      ...props,
    },
    attrs: {
      style: styleValue,
      class: classValue,
    },
    slots,
    global: {
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
}

function findVDataIterator(wrapper: ReturnType<typeof mountDataSet>) {
  return wrapper.findComponent(VDataIterator);
}

function findVList(wrapper: ReturnType<typeof mountDataSet>) {
  return wrapper.findComponent(VList);
}

function findVPagination(wrapper: ReturnType<typeof mountDataSet>) {
  return wrapper.findComponent(VPagination);
}

function findVEmptyState(wrapper: ReturnType<typeof mountDataSet>) {
  return wrapper.findComponent(VEmptyState);
}

function findVSkeletonLoader(wrapper: ReturnType<typeof mountDataSet>) {
  return wrapper.findComponent(VSkeletonLoader);
}

function findTextField(wrapper: ReturnType<typeof mountDataSet>) {
  return wrapper.findComponent(TextField);
}

function findRenderedItems(wrapper: ReturnType<typeof mountDataSet>) {
  return wrapper.findAll("[data-item]");
}
