import { VNavigationDrawer, VListItem, VListGroup } from "vuetify/components";
import NavigationMenu from "@/components/navigation-menu/navigation-menu.vue";
import TextField from "@/components/inputs/text-field/text-field.vue";
import { mount } from "@vue/test-utils";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import type {
  NavigationMenuItem,
  NavigationMenuParentItem,
} from "@/components/navigation-menu/types.ts";

const testId = "navigation-menu-test-component";
const styleValue = "random-style";
const classValue = "random-class";

describe("NavigationMenu", () => {
  let wrapper = mountNavigationMenu();
  beforeEach(() => (wrapper = mountNavigationMenu()));

  it("should exists", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain primary component", () => {
    const vNavigationDrawer = findVNavigationDrawer(wrapper);
    expect(vNavigationDrawer.exists()).toBeTruthy();
    expect(vNavigationDrawer.props("temporary")).toBeTruthy();
    expect(vNavigationDrawer.props("absolute")).toBeTruthy();
  });

  it('should inherit "data-testid" attribute', () => {
    expect(wrapper.attributes("data-testid")).toBe(testId);
  });

  it("should not inherit unexpected attributes", () => {
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).toBeUndefined();
  });

  describe("props", () => {
    const firstItem = { description: "First item", route: "/first" };
    const secondItem = { description: "Second item", route: "https://google.com" };
    const thirdItem = { description: "Third item", action: vi.fn() };
    const items: Array<NavigationMenuItem> = [firstItem, secondItem, thirdItem];

    const parentItemFirstChild = { description: "First group first item", route: "/first-first" };
    const parentItemSecondChild = { description: "First group second item", action: vi.fn() };
    const parentItem = {
      description: "First group",
      items: [parentItemFirstChild, parentItemSecondChild],
    };
    const parentItems: Array<NavigationMenuParentItem> = [parentItem];

    describe("items", () => {
      it("should not render any items when items prop is omitted", () => {
        const vListItems = findVListItems(wrapper);
        expect(vListItems).toHaveLength(0);
      });

      it("should render plain items with correct title", async () => {
        await wrapper.setProps({ items });

        const vListItems = findVListItems(wrapper);
        expect(vListItems).toHaveLength(items.length);

        expect(vListItems[0].props("title")).toBe(firstItem.description);
        expect(vListItems[1].props("title")).toBe(secondItem.description);
      });

      it("should handle plain item with local route", async () => {
        await wrapper.setProps({ items });

        const [vListItem] = findVListItems(wrapper);
        expect(vListItem.props("to")).toBe(firstItem.route);
        expect(vListItem.props("href")).toBeUndefined();
      });

      it("should handle plain item with external route", async () => {
        await wrapper.setProps({ items });

        const vListItem = findVListItems(wrapper)[1];
        expect(vListItem.props("href")).toBe(secondItem.route);
        expect(vListItem.props("to")).toBeUndefined();
      });

      it("should trigger action callback when plain item is clicked", async () => {
        await wrapper.setProps({ items });

        const { action } = thirdItem;
        expect(action).not.toHaveBeenCalled();

        const vListItem = findVListItems(wrapper)[2];
        await vListItem.trigger("click");

        expect(action).toHaveBeenCalledOnce();
      });

      it("should render grouped items correctly", async () => {
        await wrapper.setProps({ items: parentItems });

        const vListGroups = findVListGroups(wrapper);
        expect(vListGroups).toHaveLength(parentItems.length);

        const [vListGroup] = vListGroups;
        expect(vListGroup.exists()).toBeTruthy();

        const groupActivator = vListGroup.findComponent(VListItem);
        expect(groupActivator.props("title")).toBe(parentItem.description);
      });

      it("should render grouped items' children correctly", async () => {
        await wrapper.setProps({ items: parentItems });

        const [vListGroup] = findVListGroups(wrapper);
        await vListGroup.trigger("click");

        const allGroupItems = vListGroup.findAllComponents(VListItem);
        const childItems = allGroupItems.slice(1);
        expect(childItems).toHaveLength(parentItem.items.length);

        expect(childItems[0].props("title")).toBe(parentItemFirstChild.description);
        expect(childItems[0].props("to")).toBe(parentItemFirstChild.route);

        expect(childItems[1].props("title")).toBe(parentItemSecondChild.description);
      });

      it("should trigger child action when grouped child item is clicked", async () => {
        await wrapper.setProps({ items: parentItems });

        const { action } = parentItemSecondChild;
        expect(action).not.toHaveBeenCalled();

        const vListGroup = findVListGroups(wrapper)[0];
        await vListGroup.trigger("click");

        const childItem = vListGroup.findAllComponents(VListItem)[2];
        await childItem.trigger("click");

        expect(action).toHaveBeenCalledOnce();
      });

      it("should render a mix of plain and grouped items correctly", async () => {
        const mixedItems = [...items, ...parentItems];
        await wrapper.setProps({ items: mixedItems });

        const vListGroups = findVListGroups(wrapper);
        expect(vListGroups).toHaveLength(parentItems.length);

        // Find the plain item (should be a direct VListItem that's not in a group)
        const [plainItem] = wrapper.findAllComponents(VListItem);
        expect(plainItem.exists()).toBeTruthy();
        expect(plainItem.props("title")).toBe(firstItem.description);
        expect(plainItem.props("to")).toBe(firstItem.route);

        // Find the group's activator
        const groupActivator = vListGroups[0].findComponent(VListItem);
        expect(groupActivator.exists()).toBeTruthy();
        expect(groupActivator.props("title")).toBe(parentItem.description);
      });
    });

    describe("model", () => {
      it("should forward v-model value to navigation drawer", async () => {
        const vNavigationDrawer = findVNavigationDrawer(wrapper);
        expect(vNavigationDrawer.props("modelValue")).toBeFalsy();

        await wrapper.setProps({ modelValue: true });
        expect(vNavigationDrawer.props("modelValue")).toBeTruthy();
      });

      it("should emit update:modelValue when navigation drawer changes", async () => {
        const vNavigationDrawer = findVNavigationDrawer(wrapper);
        expect(wrapper.emitted("update:modelValue")).toBeFalsy();

        await vNavigationDrawer.setValue(true);

        const emitted = wrapper.emitted("update:modelValue");
        expect(emitted).toBeTruthy();
        expect(emitted?.[0]).toEqual([true]);
      });

      it("should accept initial v-model value", () => {
        const newWrapper = mount(NavigationMenu, {
          props: { modelValue: false },
          global: {
            stubs: {
              VNavigationDrawer: {
                props: ["modelValue"],
                emits: ["update:modelValue"],
                template: `<div v-bind="$props"><slot /></div>`,
              },
            },
            plugins: [vueTestUtilsPluginUimed()],
          },
        });

        const vNavigationDrawer = findVNavigationDrawer(newWrapper);
        expect(vNavigationDrawer.props("modelValue")).toBe(false);
      });
    });

    describe("search", () => {
      it("should render the search field", () => {
        const textField = findTextField(wrapper);
        expect(textField.exists()).toBeTruthy();
      });

      it("should render the search field with correct data-testid", () => {
        const textField = findTextField(wrapper);
        expect(textField.props("dataTestid")).toBe(`${testId}-search`);
      });

      it("should filter plain items by description", async () => {
        await wrapper.setProps({ items });

        const textField = findTextField(wrapper);
        await textField.setValue(thirdItem.description);

        const vListItems = findVListItems(wrapper);
        expect(vListItems).toHaveLength(1);
        expect(vListItems[0].props("title")).toBe(thirdItem.description);
      });

      it("should keep group when group's own description matches", async () => {
        await wrapper.setProps({ items: parentItems });

        const textField = findTextField(wrapper);
        await textField.setValue(parentItem.description);

        const vListGroups = findVListGroups(wrapper);
        expect(vListGroups).toHaveLength(parentItems.length);

        const groupActivator = vListGroups[0].findComponent(VListItem);
        expect(groupActivator.props("title")).toBe(parentItem.description);

        await vListGroups[0].trigger("click");
        const groupItems = vListGroups[0].findAllComponents(VListItem);
        expect(groupItems).toHaveLength(parentItem.items.length + 1); // activator + 2 children
      });

      it("should narrow group to matching children only", async () => {
        await wrapper.setProps({ items: parentItems });

        const textField = findTextField(wrapper);
        await textField.setValue(parentItemSecondChild.description);

        const vListGroups = findVListGroups(wrapper);
        expect(vListGroups).toHaveLength(1);

        await vListGroups[0].trigger("click");
        const groupItems = vListGroups[0].findAllComponents(VListItem);
        expect(groupItems).toHaveLength(2); // activator + 1 matching child

        const childItem = groupItems[1];
        expect(childItem.props("title")).toBe(parentItemSecondChild.description);
      });

      it("should exclude group when neither the group nor its children match", async () => {
        await wrapper.setProps({ items: parentItems });

        const textField = findTextField(wrapper);
        await textField.setValue("Not there");

        const vListGroups = findVListGroups(wrapper);
        expect(vListGroups).toHaveLength(0);
      });

      it("should render zero items when no matches are found", async () => {
        await wrapper.setProps({ items });

        const textField = findTextField(wrapper);
        await textField.setValue("Not there");

        const vListItems = findVListItems(wrapper);
        expect(vListItems).toHaveLength(0);
      });

      it("should restore full list when search is cleared", async () => {
        await wrapper.setProps({ items });

        const textField = findTextField(wrapper);
        await textField.setValue(firstItem.description);

        let vListItems = findVListItems(wrapper);
        expect(vListItems).toHaveLength(1);

        await textField.setValue("");

        vListItems = findVListItems(wrapper);
        expect(vListItems).toHaveLength(items.length);
      });

      it("should match case-insensitively", async () => {
        await wrapper.setProps({ items });

        const { description } = firstItem;

        const textField = findTextField(wrapper);
        await textField.setValue(description.toUpperCase());

        const vListItems = findVListItems(wrapper);
        expect(vListItems).toHaveLength(1);
        expect(vListItems[0].props("title")).toBe(description);
      });
    });
  });
});

function mountNavigationMenu() {
  return mount(NavigationMenu, {
    attrs: {
      "data-testid": testId,
      style: styleValue,
      class: classValue,
    },
    global: {
      stubs: {
        VNavigationDrawer: {
          props: { modelValue: String, temporary: Boolean, absolute: Boolean },
          emits: ["update:modelValue"],
          template: `
            <div v-bind="{ 'data-testid': $attrs['data-testid'] }">
              <slot name="prepend" />
              <slot />
            </div>
          `,
        },
      },
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
}

function findVNavigationDrawer(wrapper: ReturnType<typeof mountNavigationMenu>) {
  return wrapper.findComponent(VNavigationDrawer);
}

function findTextField(wrapper: ReturnType<typeof mountNavigationMenu>) {
  return wrapper.findComponent(TextField);
}

function findVListItems(wrapper: ReturnType<typeof mountNavigationMenu>) {
  return wrapper.findAllComponents(VListItem);
}

function findVListGroups(wrapper: ReturnType<typeof mountNavigationMenu>) {
  return wrapper.findAllComponents(VListGroup);
}
