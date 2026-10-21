// Draws each component in the states that render an icon alias of the underlying components (e.g.
// the arrows of the pagination), and checks that every icon on the page is drawn. An alias missing
// from `icons` draws nothing: its path is the name of an icon font class instead

import AppBar from "@/components/app-bar/app-bar.vue";
import DataSet from "@/components/data-sets/data-set/data-set.vue";
import Details from "@/components/details/details.vue";
import Toast from "@/components/dialogs/toast.vue";
import AutocompleteField from "@/components/inputs/autocomplete-field/autocomplete-field.vue";
import Checkbox from "@/components/inputs/checkbox/checkbox.vue";
import DateTimeField from "@/components/inputs/date-time-field/date-time-field.vue";
import MaskField from "@/components/inputs/mask-field/mask-field.vue";
import TextField from "@/components/inputs/text-field/text-field.vue";
import NavigationMenu from "@/components/navigation-menu/navigation-menu.vue";
import useToast from "@/composables/dialogs/use-toast.ts";
import { icons } from "@/consts/icons.ts";
import type { Icon } from "@/consts/types.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import * as mdiIcons from "@mdi/js";
import { mount, type VueWrapper } from "@vue/test-utils";
import { h, type Component } from "vue";
import { VLayout } from "vuetify/components";

const mdiPaths = new Set(Object.values(mdiIcons));
const wrappers: VueWrapper[] = [];

afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
});

describe("icon aliases", () => {
  it("should draw the navigation button of the app bar", async () => {
    mountAttached(AppBar, { navigation: true });

    await expectDrawnAliases(["menu"]);
  });

  it("should draw the expandable options of the app bar's user menu", async () => {
    const wrapper = mountAttached(AppBar, {
      user: { title: "Maria", options: [{ description: "Perfil", items: [] }] },
    });
    await wrapper.find("[aria-label='Menu do usuário']").trigger("click");

    await expectDrawnAliases(["expand"]);
  });

  it("should draw the close button and the icon of each color of the toasts", async () => {
    mountAttached(Toast);
    const { toast } = useToast();
    for (const color of ["positive", "informative", "caution", "danger"] as const) {
      toast({ message: color, color });
    }

    await expectDrawnAliases(["close", "success", "info", "warning", "error"]);
  });

  it("should draw the clear button of the text field", async () => {
    mountAttached(TextField, { type: "search", modelValue: "Maria" });

    await expectDrawnAliases(["clear"]);
  });

  it("should draw the clear button of the mask field", async () => {
    mountAttached(MaskField, { mask: "###", clearable: true, modelValue: "123" });

    await expectDrawnAliases(["clear"]);
  });

  it("should draw the clear button and the date picker of the date and time field", async () => {
    const wrapper = mountAttached(DateTimeField, {
      type: "datetime",
      clearable: true,
      modelValue: "2026-10-16T10:30",
    });
    await wrapper.find(".v-field__field").trigger("click");

    await expectDrawnAliases(["clear", "prev", "next", "subgroup"]);
  });

  it.each([
    ["the autocomplete field", true],
    ["the combobox", false],
  ])("should draw the menu, clear button and options of %s", async (_, strict) => {
    const wrapper = mountAttached(AutocompleteField, {
      items: ["Brasil", "Portugal"],
      modelValue: ["Brasil"],
      strict,
      multiple: true,
      clearable: true,
    });
    await vi.runAllTimersAsync();
    await wrapper.find(".v-field").trigger("mousedown");

    await expectDrawnAliases(["dropdown", "clear", "checkboxOn", "checkboxOff"]);
  });

  it.each<[string, boolean, Icon]>([
    ["checked", true, "checkboxOn"],
    ["unchecked", false, "checkboxOff"],
  ])("should draw the %s checkbox", async (_, modelValue, alias) => {
    mountAttached(Checkbox, { modelValue });

    await expectDrawnAliases([alias]);
  });

  it("should draw the groups of the navigation menu, collapsed and expanded", async () => {
    const wrapper = mountAttached(NavigationMenu, {
      modelValue: true,
      items: [{ description: "Cadastros", icon: "folder", items: [{ description: "Pacientes" }] }],
    });

    await expectDrawnAliases(["expand"]);

    await wrapper.find(".v-list-group button.v-list-item").trigger("click");

    await expectDrawnAliases(["collapse"]);
  });

  it("should draw the search item and the icons of the navigation menu's collapsed rail", async () => {
    window.innerWidth = 1280;
    window.dispatchEvent(new Event("resize"));

    try {
      mountAttached(NavigationMenu, {
        items: [
          { description: "Cadastros", icon: "folder", items: [{ description: "Pacientes" }] },
        ],
      });

      await expectDrawnAliases(["search", "folder", "expand"]);
    } finally {
      window.innerWidth = 1024;
      window.dispatchEvent(new Event("resize"));
    }
  });

  it("should draw the details, collapsed and expanded", async () => {
    const wrapper = mountAttached(Details, { title: "Detalhes" });

    await expectDrawnAliases(["expand"]);

    await wrapper.find(".v-expansion-panel-title").trigger("click");

    await expectDrawnAliases(["collapse"]);
  });

  it("should draw the pagination of the data set", async () => {
    mountAttached(DataSet, { items: [{ id: 1 }, { id: 2 }], itemsPerPage: 1 });

    await expectDrawnAliases(["prev", "next"]);
  });
});

/** Mounts the component in a layout, which the app bar and the navigation menu need */
function mountAttached(component: Component, props: Record<string, unknown> = {}) {
  const wrapper = mount(VLayout, {
    slots: { default: () => h(component, props) },
    attachTo: document.body,
    global: { plugins: [vueTestUtilsPluginUimed()] },
  });
  wrappers.push(wrapper);

  return wrapper;
}

/**
 * Expects the page, including its overlays, to draw the icons of the given aliases, and every icon
 * on it to be drawn with a path of `@mdi/js`
 */
async function expectDrawnAliases(aliases: Icon[]) {
  await vi.runAllTimersAsync();
  const drawnIcons = [...document.querySelectorAll(".v-icon")];
  const paths = drawnIcons.map((icon) => icon.querySelector("path")?.getAttribute("d"));

  expect(paths.filter((path) => !mdiPaths.has(path ?? ""))).toEqual([]);
  expect(paths).toEqual(expect.arrayContaining(aliases.map((alias) => icons[alias])));
}
