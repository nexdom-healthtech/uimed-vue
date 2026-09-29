import { nextTick, ref } from "vue";
import {
  getDataSetTotalVisible,
  useDataSetFilterKeys,
  useDataSetSearchPageReset,
} from "@/composables/data-set/data-set.ts";

type Patient = { name: string; plan: string };

describe("useDataSetFilterKeys", () => {
  it("should be undefined when search keys are undefined", () => {
    const filterKeys = useDataSetFilterKeys<Patient>(undefined);
    expect(filterKeys.value).toBeUndefined();
  });

  it("should be undefined when search keys are empty", () => {
    const filterKeys = useDataSetFilterKeys<Patient>([]);
    expect(filterKeys.value).toBeUndefined();
  });

  it("should forward the search keys when provided", () => {
    const filterKeys = useDataSetFilterKeys<Patient>(["name", "plan"]);
    expect(filterKeys.value).toEqual(["name", "plan"]);
  });

  it("should react to search keys changes", () => {
    const searchKeys = ref<Array<keyof Patient>>([]);
    const filterKeys = useDataSetFilterKeys<Patient>(searchKeys);
    expect(filterKeys.value).toBeUndefined();

    searchKeys.value = ["name"];
    expect(filterKeys.value).toEqual(["name"]);
  });

  it("should accept a getter", () => {
    const filterKeys = useDataSetFilterKeys<Patient>(() => ["plan"]);
    expect(filterKeys.value).toEqual(["plan"]);
  });
});

describe("getDataSetTotalVisible", () => {
  it.each([2, 3, 4, 5])("should show every page button for %i pages", (pageCount) => {
    expect(getDataSetTotalVisible(pageCount)).toBe(pageCount);
  });

  it.each([6, 20])("should let the buttons fit the available width for %i pages", (pageCount) => {
    expect(getDataSetTotalVisible(pageCount)).toBeUndefined();
  });
});

describe("useDataSetSearchPageReset", () => {
  it("should go back to the first page when the search changes", async () => {
    const search = ref("");
    const page = ref(3);
    useDataSetSearchPageReset(search, page);

    search.value = "ana";
    await nextTick();
    expect(page.value).toBe(1);
  });

  it("should keep the page while the search doesn't change", async () => {
    const search = ref("ana");
    const page = ref(3);
    useDataSetSearchPageReset(search, page);

    await nextTick();
    expect(page.value).toBe(3);
  });

  it("should accept a getter", async () => {
    const search = ref("");
    const page = ref(2);
    useDataSetSearchPageReset(() => search.value, page);

    search.value = "ana";
    await nextTick();
    expect(page.value).toBe(1);
  });
});
