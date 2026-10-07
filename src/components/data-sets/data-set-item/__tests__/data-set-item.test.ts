import { VCard, VCardActions } from "vuetify/components";
import { mount } from "@vue/test-utils";
import Button from "@/components/button/button.vue";
import DataSetItem from "@/components/data-sets/data-set-item/data-set-item.vue";
import Section from "@/components/sections/section/section.vue";
import SectionContent from "@/components/sections/section-content/section-content.vue";
import type { SectionVariant } from "@/components/sections/section/types.ts";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

const testId = "data-set-item-test-id";
const styleValue = "random-style";
const classValue = "random-class";

const variants: [SectionVariant, string][] = [
  ["primary", "elevated"],
  ["secondary", "outlined"],
];

describe("DataSetItem", () => {
  it("should exist", () => {
    const wrapper = mountDataSetItem();
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain primary component", () => {
    const wrapper = mountDataSetItem();
    expect(findSection(wrapper).exists()).toBeTruthy();
  });

  it("should not inherit unexpected attributes", () => {
    const wrapper = mountDataSetItem();
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).toBeUndefined();
  });

  it("should fill the height of its column", () => {
    const wrapper = mountDataSetItem();
    expect(findSection(wrapper).props("fullHeight")).toBe(true);
    expect(findVCard(wrapper).classes()).toContain("h-100");
  });

  describe("props", () => {
    describe("title", () => {
      it("should forward to the section", () => {
        const wrapper = mountDataSetItem({ title: "Ana Souza" });
        expect(findSection(wrapper).props("title")).toBe("Ana Souza");
        expect(findVCard(wrapper).text()).toContain("Ana Souza");
      });

      it("should be undefined by default", () => {
        const wrapper = mountDataSetItem();
        expect(findSection(wrapper).props("title")).toBeUndefined();
      });
    });

    describe("subtitle", () => {
      it("should forward to the section", () => {
        const wrapper = mountDataSetItem({ subtitle: "Beneficiária desde 2020" });
        expect(findSection(wrapper).props("subtitle")).toBe("Beneficiária desde 2020");
        expect(findVCard(wrapper).text()).toContain("Beneficiária desde 2020");
      });

      it("should be undefined by default", () => {
        const wrapper = mountDataSetItem();
        expect(findSection(wrapper).props("subtitle")).toBeUndefined();
      });
    });

    describe("variant", () => {
      it.each(variants)(
        'should forward `variant="%s"` to the section, styled as `%s`',
        (variant, vuetifyVariant) => {
          const wrapper = mountDataSetItem({ variant });
          expect(findSection(wrapper).props("variant")).toBe(variant);
          expect(findVCard(wrapper).props("variant")).toBe(vuetifyVariant);
        },
      );

      it("should use the section's default variant when not set", () => {
        const wrapper = mountDataSetItem();
        expect(findSection(wrapper).props("variant")).toBeUndefined();
        expect(findVCard(wrapper).props("variant")).toBe("elevated");
      });
    });

    describe("actions", () => {
      it("should forward to the section, rendering a button per action in order", () => {
        const actions = [
          { label: "Editar", variant: "secondary", onClick: vi.fn() },
          { label: "Excluir", color: "danger", variant: "secondary", onClick: vi.fn() },
        ];
        const wrapper = mountDataSetItem({ actions });

        expect(findSection(wrapper).props("actions")).toEqual(actions);
        const buttons = findVCardActions(wrapper).findAllComponents(Button);
        expect(buttons.map((button) => button.text())).toEqual(["Editar", "Excluir"]);
        expect(buttons[0]?.props("variant")).toBe("secondary");
        expect(buttons[1]?.props("color")).toBe("danger");
      });

      it("should call only the clicked action's onClick", async () => {
        const edit = vi.fn();
        const remove = vi.fn();
        const wrapper = mountDataSetItem({
          actions: [
            { label: "Editar", onClick: edit },
            { label: "Excluir", onClick: remove },
          ],
        });

        await findVCardActions(wrapper).findAll("button")[1]?.trigger("click");

        expect(remove).toHaveBeenCalledOnce();
        expect(remove).toHaveBeenCalledWith(expect.any(MouseEvent));
        expect(edit).not.toHaveBeenCalled();
      });

      it("should not render the actions area when undefined", () => {
        const wrapper = mountDataSetItem();
        expect(findSection(wrapper).props("actions")).toBeUndefined();
        expect(findVCardActions(wrapper).exists()).toBeFalsy();
      });

      it("should not render the actions area when empty", () => {
        const wrapper = mountDataSetItem({ actions: [] });
        expect(findSection(wrapper).props("actions")).toEqual([]);
        expect(findVCardActions(wrapper).exists()).toBeFalsy();
      });
    });

    describe("dataTestid", () => {
      it("should forward to the section", () => {
        const wrapper = mountDataSetItem();
        expect(findSection(wrapper).props("dataTestid")).toBe(testId);
        expect(findVCard(wrapper).attributes("data-testid")).toBe(testId);
      });

      it("should not set data-testid when undefined", () => {
        const wrapper = mountDataSetItem({ dataTestid: undefined });
        expect(findVCard(wrapper).attributes("data-testid")).toBeUndefined();
      });
    });
  });

  describe("slots", () => {
    describe("default", () => {
      it("should forward the default slot content to the section content", () => {
        const wrapper = mountDataSetItem();
        const sectionContent = findSectionContent(wrapper);
        expect(sectionContent.exists()).toBeTruthy();
        expect(sectionContent.text()).toBe("Test Content");
        expect(findSection(wrapper).findComponent(SectionContent).exists()).toBeTruthy();
      });

      it("should not render the section content without the default slot", () => {
        const wrapper = mountDataSetItem({ title: "Ana Souza" }, {});
        expect(findSectionContent(wrapper).exists()).toBeFalsy();
        expect(findVCard(wrapper).text()).toBe("Ana Souza");
      });
    });
  });
});

function mountDataSetItem(
  props: Record<string, unknown> = {},
  slots: Record<string, string> = { default: "Test Content" },
) {
  return mount(DataSetItem, {
    props: {
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

function findSection(wrapper: ReturnType<typeof mountDataSetItem>) {
  return wrapper.findComponent(Section);
}

function findSectionContent(wrapper: ReturnType<typeof mountDataSetItem>) {
  return wrapper.findComponent(SectionContent);
}

function findVCard(wrapper: ReturnType<typeof mountDataSetItem>) {
  return wrapper.findComponent(VCard);
}

function findVCardActions(wrapper: ReturnType<typeof mountDataSetItem>) {
  return wrapper.findComponent(VCardActions);
}
