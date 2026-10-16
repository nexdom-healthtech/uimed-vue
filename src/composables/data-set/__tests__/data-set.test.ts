import { effectScope, nextTick, ref } from "vue";
import type { DataSetColumns } from "@/components/data-sets/data-set/types.ts";
import {
  getDataSetFittingColumns,
  getDataSetTotalVisible,
  useDataSetColumnCols,
  useDataSetFilterKeys,
  useDataSetFittingColumns,
  useDataSetWidth,
  useDataSetSearchPageReset,
} from "@/composables/data-set/data-set.ts";

type Patient = { name: string; plan: string };

describe("useDataSetColumnCols", () => {
  it.each([
    [1, "12"],
    [2, "6"],
    [3, "4"],
    [4, "3"],
    [6, "2"],
  ] as const)("should fit %i records per row in columns of size %s", (columns, cols) => {
    expect(useDataSetColumnCols(columns).value).toBe(cols);
  });

  it("should react to columns changes", () => {
    const columns = ref<DataSetColumns>(2);
    const cols = useDataSetColumnCols(columns);
    expect(cols.value).toBe("6");

    columns.value = 4;
    expect(cols.value).toBe("3");
  });

  it("should accept a getter", () => {
    const cols = useDataSetColumnCols(() => 6);
    expect(cols.value).toBe("2");
  });
});

describe("getDataSetFittingColumns", () => {
  it.each([1, 2, 3, 4, 6] as const)(
    "should keep %i columns while the width is unknown",
    (columns) => {
      expect(getDataSetFittingColumns(columns, 0)).toBe(columns);
    },
  );

  it.each([
    [100, 3, 1],
    [239, 6, 1],
    [240, 6, 1],
    [503, 6, 1],
    [504, 6, 2],
    [767, 6, 2],
    [768, 6, 3],
    [1031, 6, 3],
    [1032, 6, 4],
    [1295, 6, 4],
    [1296, 6, 4],
    [1559, 6, 4],
    [1560, 6, 6],
    [2000, 6, 6],
  ] as const)(
    "should fit cards of at least 240px, 24px apart, in %ipx, up to %i columns, as %i columns",
    (width, columns, expected) => {
      expect(getDataSetFittingColumns(columns, width)).toBe(expected);
    },
  );

  it.each([
    [420, 4, 1],
    [800, 4, 3],
    [1100, 4, 4],
    [1100, 6, 4],
    [1440, 4, 4],
    [1440, 3, 3],
    [1440, 2, 2],
    [1440, 1, 1],
    [960, 3, 3],
  ] as const)(
    "should never exceed the given columns (%ipx, up to %i columns, as %i columns)",
    (width, columns, expected) => {
      expect(getDataSetFittingColumns(columns, width)).toBe(expected);
    },
  );
});

describe("useDataSetFittingColumns", () => {
  it("should react to columns and width changes", () => {
    const columns = ref<DataSetColumns>(4);
    const width = ref(0);
    const fittingColumns = useDataSetFittingColumns(columns, width);
    expect(fittingColumns.value).toBe(4);

    width.value = 800;
    expect(fittingColumns.value).toBe(3);

    columns.value = 2;
    expect(fittingColumns.value).toBe(2);
  });

  it("should accept getters", () => {
    const fittingColumns = useDataSetFittingColumns(
      () => 6,
      () => 1100,
    );
    expect(fittingColumns.value).toBe(4);
  });
});

describe("useDataSetWidth", () => {
  const originalResizeObserver = globalThis.ResizeObserver;

  beforeEach(() => {
    MockResizeObserver.instances = [];
    globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
  });

  afterEach(() => {
    globalThis.ResizeObserver = originalResizeObserver;
  });

  it("should be 0 and not observe anything without an element", () => {
    const { width } = runInScope(() => useDataSetWidth(null));
    expect(width.value).toBe(0);
    expect(MockResizeObserver.instances).toHaveLength(0);
  });

  it("should observe the element right away", () => {
    const element = document.createElement("div");
    const { width } = runInScope(() => useDataSetWidth(element));

    expect(MockResizeObserver.instances).toHaveLength(1);
    expect(MockResizeObserver.instances[0].observe).toHaveBeenCalledWith(element);
    expect(width.value).toBe(0);
  });

  it("should follow the element's width", () => {
    const { width } = runInScope(() => useDataSetWidth(document.createElement("div")));

    MockResizeObserver.instances[0].resize(480);
    expect(width.value).toBe(480);

    MockResizeObserver.instances[0].resize(300);
    expect(width.value).toBe(300);
  });

  it("should observe the new element when it changes", async () => {
    const first = document.createElement("div");
    const second = document.createElement("div");
    const element = ref<Element>(first);
    const { width } = runInScope(() => useDataSetWidth(element));
    MockResizeObserver.instances[0].resize(480);

    element.value = second;
    await nextTick();

    expect(MockResizeObserver.instances[0].disconnect).toHaveBeenCalledOnce();
    expect(MockResizeObserver.instances).toHaveLength(2);
    expect(MockResizeObserver.instances[1].observe).toHaveBeenCalledWith(second);
    expect(width.value).toBe(0);
  });

  it("should stop observing and go back to 0 when the element is gone", async () => {
    const element = ref<Element | null>(document.createElement("div"));
    const { width } = runInScope(() => useDataSetWidth(element));
    MockResizeObserver.instances[0].resize(480);

    element.value = null;
    await nextTick();

    expect(MockResizeObserver.instances[0].disconnect).toHaveBeenCalledOnce();
    expect(MockResizeObserver.instances).toHaveLength(1);
    expect(width.value).toBe(0);
  });

  it("should disconnect when the scope is disposed", () => {
    const { scope } = runInScope(() => useDataSetWidth(document.createElement("div")));
    expect(MockResizeObserver.instances[0].disconnect).not.toHaveBeenCalled();

    scope.stop();
    expect(MockResizeObserver.instances[0].disconnect).toHaveBeenCalledOnce();
  });

  it("should not disconnect the same observer twice", async () => {
    const element = ref<Element | null>(document.createElement("div"));
    const { scope } = runInScope(() => useDataSetWidth(element));

    element.value = null;
    await nextTick();
    scope.stop();

    expect(MockResizeObserver.instances[0].disconnect).toHaveBeenCalledOnce();
  });

  it("should accept a getter", () => {
    const element = document.createElement("div");
    runInScope(() => useDataSetWidth(() => element));
    expect(MockResizeObserver.instances[0].observe).toHaveBeenCalledWith(element);
  });
});

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

class MockResizeObserver {
  static instances: MockResizeObserver[] = [];

  readonly observe = vi.fn();
  readonly unobserve = vi.fn();
  readonly disconnect = vi.fn();

  constructor(private readonly callback: ResizeObserverCallback) {
    MockResizeObserver.instances.push(this);
  }

  resize(width: number) {
    const entry = { contentRect: { width } } as ResizeObserverEntry;
    this.callback([entry], this as unknown as ResizeObserver);
  }
}

function runInScope<T>(composable: () => T) {
  const scope = effectScope();
  const width = scope.run(composable) as T;
  return { scope, width };
}
