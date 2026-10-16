import { mount } from "@vue/test-utils";
import { VCol, VDefaultsProvider, VTextField } from "vuetify/components";
import Button from "@/components/button/button.vue";
import DataSetBar from "@/components/data-sets/data-set-bar.vue";
import Column from "@/components/grid/column/column.vue";
import TextField from "@/components/inputs/text-field/text-field.vue";
import type { SectionAction } from "@/components/sections/section/types.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

describe("DataSetBar", () => {
  it("should not render anything by default", () => {
    const wrapper = mountDataSetBar();
    expect(findLines(wrapper)).toHaveLength(0);
    expect(wrapper.text()).toBe("");
  });

  it("should not render anything when actions is empty", () => {
    const wrapper = mountDataSetBar({ actions: [] });
    expect(findLines(wrapper)).toHaveLength(0);
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountDataSetBar(
      { actions: [{ label: "Novo paciente" }], searchable: true },
      { class: "random-class" },
    );
    expect(findLines(wrapper)).toHaveLength(2);
    expect(wrapper.find(".random-class").exists()).toBeFalsy();
  });

  describe("searchable", () => {
    it("should render only the search field when there are no actions", () => {
      const wrapper = mountDataSetBar({ searchable: true });
      const textField = findTextField(wrapper);
      expect(textField.props("type")).toBe("search");
      expect(textField.props("label")).toBe("Pesquisar");
      expect(findButtons(wrapper)).toHaveLength(0);
    });

    it("should push the search field to the end of the bar, with a width of its own", () => {
      const wrapper = mountDataSetBar({ searchable: true });
      const searchColumn = findSearchColumn(wrapper);
      expect(searchColumn?.findComponent(TextField).exists()).toBe(true);
      expect(wrapper.findComponent(Column).exists()).toBeFalsy();
      expect(searchColumn?.classes()).toEqual(
        expect.arrayContaining(["ms-auto", "v-col--cols-12", "v-col--cols-sm-auto"]),
      );
    });

    it("should hide the empty messages area of the search field and keep it as wide as a card", () => {
      const wrapper = mountDataSetBar({ searchable: true });
      const defaultsProvider = findSearchColumn(wrapper)?.findComponent(VDefaultsProvider);
      expect(defaultsProvider?.props("defaults")).toEqual({
        VTextField: { hideDetails: "auto", minWidth: 240 },
      });
      expect(defaultsProvider?.findComponent(TextField).exists()).toBe(true);
      expect(wrapper.findComponent(VTextField).attributes("style")).toContain("min-width: 240px;");
      expect(wrapper.findComponent(VTextField).find(".v-input__details").classes()).toContain(
        "v-input__details--hidden",
      );
    });

    it("should bind the search field to the model", async () => {
      const wrapper = mountDataSetBar({ searchable: true, modelValue: "ana" });
      expect(findTextField(wrapper).props("modelValue")).toBe("ana");

      await findTextField(wrapper).find("input").setValue("carla");
      expect(wrapper.emitted("update:modelValue")).toEqual([["carla"]]);
    });

    it("should start with an empty search", () => {
      const wrapper = mountDataSetBar({ searchable: true });
      expect(findTextField(wrapper).props("modelValue")).toBe("");
    });
  });

  describe("actions", () => {
    it("should render only the actions when not searchable", () => {
      const wrapper = mountDataSetBar({ actions: [{ label: "Novo paciente" }] });
      expect(findButtons(wrapper)).toHaveLength(1);
      expect(findTextField(wrapper).exists()).toBeFalsy();
    });

    it("should render one button per action, in order, before the search field", () => {
      const wrapper = mountDataSetBar({
        actions: [{ label: "Novo paciente" }, { label: "Importar" }],
        searchable: true,
      });
      const columns = findLines(wrapper);
      expect(columns).toHaveLength(3);
      expect(columns[0].text()).toBe("Novo paciente");
      expect(columns[1].text()).toBe("Importar");
      expect(columns[2].element).toBe(findSearchColumn(wrapper)?.element);
      expect(findButtons(wrapper).map((button) => button.text())).toEqual([
        "Novo paciente",
        "Importar",
      ]);
    });

    it("should render each action in a column with its own width, full width on extra small screens", () => {
      const wrapper = mountDataSetBar({ actions: [{ label: "Novo paciente" }] });
      const column = wrapper.findComponent(Column);
      expect(column.props("cols")).toBe("auto");
      expect(column.props("listItem")).toBeFalsy();
      expect(findButtons(wrapper)[0].props("fullWidth")).toBe(true);
    });

    it("should let an action keep its natural width on extra small screens", () => {
      const wrapper = mountDataSetBar({ actions: [{ label: "Novo paciente", fullWidth: false }] });
      expect(findButtons(wrapper)[0].props("fullWidth")).toBe(false);
    });

    it("should forward the action props to the buttons", () => {
      const wrapper = mountDataSetBar({
        actions: [
          {
            label: "Novo paciente",
            variant: "secondary",
            type: "submit",
            color: "danger",
            disabled: true,
            loading: true,
            form: "test-form",
            dataTestid: "action-btn",
          },
        ],
      });
      const button = findButtons(wrapper)[0];
      expect(button.props("variant")).toBe("secondary");
      expect(button.props("type")).toBe("submit");
      expect(button.props("color")).toBe("danger");
      expect(button.props("disabled")).toBe(true);
      expect(button.props("loading")).toBe(true);
      expect(button.props("form")).toBe("test-form");
      expect(button.attributes("data-testid")).toBe("action-btn");
      expect(button.attributes("label")).toBeUndefined();
    });

    it("should render an action with a route as a link", () => {
      const route = "https://example.com/help";
      const wrapper = mountDataSetBar({ actions: [{ label: "Ajuda", route }] });
      const button = findButtons(wrapper)[0];
      expect(button.props("route")).toBe(route);
      expect(button.find("a").attributes("href")).toBe(route);
    });

    it("should call the clicked action with the click event", async () => {
      const create = vi.fn();
      const importItems = vi.fn();
      const wrapper = mountDataSetBar({
        actions: [
          { label: "Novo paciente", onClick: create },
          { label: "Importar", onClick: importItems },
        ],
      });
      await findButtons(wrapper)[1].trigger("click");

      expect(importItems).toHaveBeenCalledOnce();
      expect(importItems).toHaveBeenCalledWith(expect.any(MouseEvent));
      expect(create).not.toHaveBeenCalled();
    });

    it("should not call a disabled action", async () => {
      const create = vi.fn();
      const wrapper = mountDataSetBar({
        actions: [{ label: "Novo paciente", disabled: true, onClick: create }],
      });
      await findButtons(wrapper)[0].trigger("click");
      expect(create).not.toHaveBeenCalled();
    });
  });
});

function mountDataSetBar(
  props: { actions?: SectionAction[]; searchable?: boolean; modelValue?: string } = {},
  attrs: Record<string, unknown> = {},
) {
  return mount(DataSetBar, {
    props,
    attrs,
    global: {
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
}

/**
 * Finds the columns rendered by the bar, one per action and one for the search
 * field.
 */
function findLines(wrapper: ReturnType<typeof mountDataSetBar>) {
  return wrapper.findAll(".v-col");
}

function findButtons(wrapper: ReturnType<typeof mountDataSetBar>) {
  return wrapper.findAllComponents(Button);
}

function findTextField(wrapper: ReturnType<typeof mountDataSetBar>) {
  return wrapper.findComponent(TextField);
}

/**
 * Finds the last column of the bar, where the search field is rendered.
 */
function findSearchColumn(wrapper: ReturnType<typeof mountDataSetBar>) {
  return wrapper.findAllComponents(VCol).at(-1);
}
