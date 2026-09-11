import { VAppBar, VAvatar, VBtn, VCard, VListGroup, VListItem, VMenu } from "vuetify/components";
import AppBar from "@/components/app-bar/app-bar.vue";
import { mount } from "@vue/test-utils";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import useRouteProps, { isExternalRoute } from "@/composables/navigation/use-route-props.ts";
import type { AppBarUserProps, Option, ParentOption } from "@/components/app-bar/types.ts";

const testId = "app-bar-test-component";
const styleValue = "random-style";
const classValue = "random-class";

vi.mock(import("@/composables/navigation/use-route-props.ts"), { spy: true });

describe("AppBar", () => {
  let wrapper = mountAppBar();
  beforeEach(() => (wrapper = mountAppBar()));

  it("should exists", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain primary component", () => {
    expect(wrapper.findComponent(VAppBar).exists()).toBeTruthy();
  });

  it('should inherit "data-testid" attribute', () => {
    expect(wrapper.attributes("data-testid")).toBe(testId);
  });

  it("should not inherit unexpected attributes", () => {
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).toBeUndefined();
  });

  describe("props", () => {
    describe("title", () => {
      it("should forward title to the app bar", async () => {
        const title = "AI Chat";
        await wrapper.setProps({ title });

        const vAppBar = findVAppBar(wrapper);
        expect(vAppBar.props("title")).toBe(title);
      });
    });

    describe("help", () => {
      const help = "/help";

      it("should add a button to navigate to help page", async () => {
        let vBtn = findVBtn(wrapper);
        expect(vBtn.exists()).toBeFalsy();

        await wrapper.setProps({ help });

        vBtn = findVBtn(wrapper);
        expect(vBtn.exists()).toBeTruthy();
        expect(vBtn.props("icon")).toBe("mdi-help-circle-outline");
        expect(vBtn.attributes("data-testid")).toBe(`${testId}-help`);
      });

      it("should use route props composable and propagate it's result", async () => {
        expect(useRouteProps).toHaveBeenCalledOnce();

        await wrapper.setProps({ help });

        const vBtn = findVBtn(wrapper);
        expect(vBtn.props("to")).toBe(help);
        expect(vBtn.props("href")).toBeUndefined();
      });
    });

    describe("user", () => {
      const user = { title: "Beetlejuice", subtitle: "beetle3x@gmail.com" };

      it("should add a button to access user menu", async () => {
        let vBtn = findVBtn(wrapper);
        expect(vBtn.exists()).toBeFalsy();

        await wrapper.setProps({ user });

        vBtn = findVBtn(wrapper);
        expect(vBtn.exists()).toBeTruthy();
        expect(vBtn.props("icon")).toBeTruthy();
        expect(vBtn.attributes("data-testid")).toBe(`${testId}-user`);

        const vAvatar = findVAvatar(wrapper);
        expect(vAvatar.exists()).toBeTruthy();
        expect(vAvatar.props("color")).toBe("primary");
        expect(vAvatar.props("icon")).toBe("mdi-account-outline");
      });

      it("should open user menu when button is clicked", async () => {
        await wrapper.setProps({ user });

        const vBtn = findVBtn(wrapper);
        const vMenu = findVMenu(wrapper);

        expect(vMenu.exists()).toBeTruthy();
        expect(vMenu.props("closeOnContentClick")).toBeFalsy();
        expect(vMenu.emitted("update:modelValue")).toBeFalsy();

        await vBtn.trigger("click");
        expect(vMenu.emitted("update:modelValue")).toBeTruthy();
        expect(vMenu.emitted("update:modelValue")?.[0]).toBeTruthy();
      });

      describe("title and subtitle", () => {
        it("should present user info in the menu", async () => {
          await wrapper.setProps({ user });

          const vBtn = findVBtn(wrapper);
          await vBtn.trigger("click");

          const vCard = findVCard(wrapper);
          expect(vCard.exists()).toBeTruthy();
          expect(vCard.attributes("data-testid")).toBe(`${testId}-user-menu`);

          const cardText = vCard.text();
          expect(cardText).toContain(user.title);
          expect(cardText).toContain(user.subtitle);

          const vCardAvatar = findVCardAvatar(vCard);
          expect(vCardAvatar.props("icon")).toBe("mdi-account-outline");
          expect(vCardAvatar.props("image")).toBeUndefined();
        });
      });

      describe("img", () => {
        it("should handle user picture when provided", async () => {
          const img: AppBarUserProps["img"] = "/picture.png";
          await wrapper.setProps({ user: { ...user, img } });

          const vBtn = findVBtn(wrapper);
          expect(vBtn.props("icon")).toBeTruthy();

          const vAvatar = findVAvatar(wrapper);
          expect(vAvatar.exists()).toBeTruthy();
          expect(vAvatar.props("color")).toBe("primary");
          expect(vAvatar.props("icon")).toBeUndefined();
          expect(vAvatar.props("image")).toBe(img);

          await vBtn.trigger("click");

          const vCard = findVCard(wrapper);
          const vCardAvatar = findVCardAvatar(vCard);
          expect(vCardAvatar.props("icon")).toBeUndefined();
          expect(vCardAvatar.props("image")).toBe(img);
        });
      });

      describe("options", () => {
        it("should present options", async () => {
          const options: Array<Option> = [
            { description: "First item", route: "/first" },
            { description: "Second item", route: "http:///localhost:8080" },
            { description: "Third item", action: vi.fn() },
          ];
          await wrapper.setProps({ user: { ...user, options } });

          const vBtn = findVBtn(wrapper);
          await vBtn.trigger("click");

          const vCard = findVCard(wrapper);
          const vCardOptions = findVCardOptions(vCard);
          await validateUserOptions(options, vCardOptions);
        });

        it("should be able to group options", async () => {
          const options: Array<ParentOption> = [
            {
              description: "First group",
              items: [
                { description: "First group first item", route: "/first-first" },
                { description: "First group second  item", action: vi.fn() },
              ],
            },
            {
              description: "Second group",
              items: [
                { description: "Second group first item", route: "/second-first" },
                { description: "Second group second  item", action: vi.fn() },
              ],
            },
          ];
          await wrapper.setProps({ user: { ...user, options } });

          const vBtn = findVBtn(wrapper);
          await vBtn.trigger("click");

          const vCard = findVCard(wrapper);
          const vCardOptionGroups = findVCardOptionGroups(vCard);
          expect(vCardOptionGroups).toHaveLength(options.length);

          await Promise.all(
            vCardOptionGroups.map(async (groupOptions, index) => {
              expect(groupOptions.exists()).toBeTruthy();

              await groupOptions.trigger("click");

              const [groupOption, ...groupItems] = groupOptions.findAllComponents(VListItem);
              expect(groupOption.props("title")).toBe(options[index].description);

              await validateUserOptions(options[index].items, groupItems);
            }),
          );
        });
      });
    });
  });
});

function mountAppBar() {
  return mount(AppBar, {
    attrs: {
      "data-testid": testId,
      style: styleValue,
      class: classValue,
    },
    global: {
      stubs: {
        VAppBar: {
          props: ["title"],
          template: `
            <div v-bind="$props">
              <slot />
              <slot name="append" />
            </div>
          `,
        },
      },
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
}

function findVAppBar(wrapper: ReturnType<typeof mountAppBar>) {
  return wrapper.findComponent(VAppBar);
}

function findVBtn(wrapper: ReturnType<typeof mountAppBar>) {
  return wrapper.findComponent(VBtn);
}

function findVMenu(wrapper: ReturnType<typeof mountAppBar>) {
  return wrapper.findComponent(VMenu);
}

function findVCard(wrapper: ReturnType<typeof mountAppBar>) {
  return wrapper.findComponent(VCard);
}

function findVAvatar(wrapper: ReturnType<typeof mountAppBar>) {
  return wrapper.findComponent(VAvatar);
}

function findVCardAvatar(vCard: ReturnType<typeof findVCard>) {
  return vCard.findComponent(VAvatar);
}

function findVCardOptionGroups(vCard: ReturnType<typeof findVCard>) {
  return vCard.findAllComponents(VListGroup);
}

function findVCardOptions(vCard: ReturnType<typeof findVCard>) {
  return vCard.findAllComponents(VListItem);
}

async function validateUserOptions(
  options: Array<Option>,
  vCardOptions: ReturnType<typeof findVCardOptions>,
) {
  expect(vCardOptions).toHaveLength(options.length);

  await Promise.all(
    vCardOptions.map(async (option, index) => {
      expect(option.exists()).toBeTruthy();
      expect(option.props("title")).toBe(options[index].description);

      const route = options[index].route;
      expect(option.props(isExternalRoute(route) ? "href" : "to")).toBe(route);
      expect(option.props(isExternalRoute(route) ? "to" : "href")).toBeUndefined();

      if (options[index].action) {
        expect(options[index].action).not.toHaveBeenCalled();

        await option.trigger("click");
        expect(options[index].action).toHaveBeenCalledOnce();
      }
    }),
  );
}
