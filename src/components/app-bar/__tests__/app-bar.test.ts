import {
  VAppBar,
  VAppBarNavIcon,
  VAppBarTitle,
  VAvatar,
  VBadge,
  VBtn,
  VCard,
  VIcon,
  VImg,
  VListGroup,
  VListItem,
  VMenu,
} from "vuetify/components";
import AppBar from "@/components/app-bar/app-bar.vue";
import { mount } from "@vue/test-utils";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";
import useRouteProps, { isExternalRoute } from "@/composables/navigation/use-route-props.ts";
import type { AppBarUserProps, Option, ParentOption } from "@/components/app-bar/types.ts";
import { formatDateTime, navigatePeriod } from "@nexdom/shared/utils";

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
    expect(findVAppBar(wrapper).exists()).toBeTruthy();
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
        let vAppBarTitle = findVAppBarTitle(wrapper);
        expect(vAppBarTitle.exists()).toBeFalsy();

        const title = "AI Chat";
        await wrapper.setProps({ title });

        vAppBarTitle = findVAppBarTitle(wrapper);
        expect(vAppBarTitle.exists()).toBeTruthy();
        expect(vAppBarTitle.text()).toBe(title);
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

    describe("notifications", () => {
      const notifications = [
        { title: "First notification", subtitle: "Details", read: false },
        { title: "Second notification", subtitle: "More details", read: true },
        { title: "Third notification", subtitle: "Even more details", read: false },
        { title: "Fourth notification", subtitle: "Furthermore details", read: true },
        { title: "Fifth notification", subtitle: "Furthermore details", read: true },
      ];

      it("should add a button to access notifications menu", async () => {
        let vBtn = findVBtn(wrapper);
        expect(vBtn.exists()).toBeFalsy();

        await wrapper.setProps({ notifications });

        vBtn = findVBtn(wrapper);
        expect(vBtn.exists()).toBeTruthy();
        expect(vBtn.attributes("data-testid")).toBe(`${testId}-notifications`);

        const vBtnIcon = vBtn.findComponent(VIcon);
        expect(vBtnIcon.props("icon")).toBe("mdi-bell-outline");
      });

      it("should show the button even when notifications is an empty array", async () => {
        await wrapper.setProps({ notifications: [] });

        const vBtn = findVBtn(wrapper);
        expect(vBtn.exists()).toBeTruthy();
      });

      it("should open notifications menu when button is clicked", async () => {
        await wrapper.setProps({ notifications });

        const vBtn = findVBtn(wrapper);
        const vMenu = findVMenu(wrapper);

        expect(vMenu.exists()).toBeTruthy();
        expect(vMenu.props("closeOnContentClick")).toBeFalsy();
        expect(vMenu.emitted("update:modelValue")).toBeFalsy();

        await vBtn.trigger("click");
        expect(vMenu.emitted("update:modelValue")).toBeTruthy();
        expect(vMenu.emitted("update:modelValue")?.[0]).toBeTruthy();
      });

      describe("badge", () => {
        it("should reflect the unread notifications count", async () => {
          await wrapper.setProps({ notifications });

          const vBadge = findVBadge(wrapper);
          expect(vBadge.exists()).toBeTruthy();
          expect(vBadge.props("modelValue")).toBeTruthy();
          expect(vBadge.props("content")).toBe(2);
        });

        it("should be hidden when there are no unread notifications", async () => {
          await wrapper.setProps({
            notifications: notifications.map((notification) => ({ ...notification, read: true })),
          });

          const vBadge = findVBadge(wrapper);
          expect(vBadge.props("modelValue")).toBeFalsy();
          expect(vBadge.props("content")).toBe(0);
        });
      });

      describe("notificationsOpen", () => {
        it("should forward value to the notifications menu", async () => {
          await wrapper.setProps({ notifications, notificationsOpen: true });

          const vMenu = findVMenu(wrapper);
          expect(vMenu.props("modelValue")).toBe(true);
        });

        it("should emit update:notificationsOpen when the menu changes internally", async () => {
          await wrapper.setProps({ notifications });

          const vMenu = findVMenu(wrapper);
          await vMenu.setValue(true);

          const emitted = wrapper.emitted("update:notificationsOpen");
          expect(emitted).toBeTruthy();
          expect(wrapper.emitted("update:notificationsOpen")?.[0]).toEqual([true]);
        });
      });

      describe("content", () => {
        it("should list each notification's title and subtitle in order", async () => {
          await wrapper.setProps({ notifications });

          const vBtn = findVBtn(wrapper);
          await vBtn.trigger("click");

          const vCard = findVCard(wrapper);
          expect(vCard.attributes("data-testid")).toBe(`${testId}-notifications-menu`);

          const vCardNotifications = findVCardNotifications(vCard);
          expect(vCardNotifications).toHaveLength(notifications.length);

          vCardNotifications.forEach((vListItem, index) => {
            expect(vListItem.props("title")).toBe(notifications[index].title);
            expect(vListItem.props("subtitle")).toBe(notifications[index].subtitle);
          });
        });

        it("should indicate unread notifications", async () => {
          await wrapper.setProps({ notifications });

          const vBtn = findVBtn(wrapper);
          await vBtn.trigger("click");

          const vCard = findVCard(wrapper);
          const vCardNotifications = findVCardNotifications(vCard);

          vCardNotifications.forEach((vCardNotification, index) => {
            expect(vCardNotification.props("activeClass")).toBe("text-primary");
            expect(vCardNotification.props("active")).toBe(!notifications[index].read);
          });
        });

        it("should not present notification date/time when none is provided", async () => {
          await wrapper.setProps({ notifications });

          const vBtn = findVBtn(wrapper);
          await vBtn.trigger("click");

          const vCard = findVCard(wrapper);
          const vCardNotifications = findVCardNotifications(vCard);

          vCardNotifications.forEach((vCardNotification) => {
            expect(findNotificationDate(vCardNotification).exists()).toBeFalsy();
          });
        });

        it("should handle notification date/time presentation", async () => {
          const date = new Date();
          const dates = [
            { provide: date, expect: formatDateTime(date, "HH:mm") },
            { provide: navigatePeriod(date, { days: -1 }), expect: "Ontem" },
            {
              provide: navigatePeriod(date, { days: -2 }),
              expect: formatDateTime(navigatePeriod(date, { days: -2 }), "DD/MM/YYYY"),
            },
            {
              provide: navigatePeriod(date, { months: -1 }),
              expect: formatDateTime(navigatePeriod(date, { months: -1 }), "DD/MM/YYYY"),
            },
            {
              provide: navigatePeriod(date, { years: -1 }),
              expect: formatDateTime(navigatePeriod(date, { years: -1 }), "DD/MM/YYYY"),
            },
          ];
          expect(dates).toHaveLength(notifications.length);

          const updateNotifications = notifications.map((notification, index) => ({
            ...notification,
            date: dates[index].provide,
          }));
          await wrapper.setProps({ notifications: updateNotifications });

          const vBtn = findVBtn(wrapper);
          await vBtn.trigger("click");

          const vCard = findVCard(wrapper);
          const vCardNotifications = findVCardNotifications(vCard);
          expect(vCardNotifications).toHaveLength(notifications.length);

          vCardNotifications.forEach((vCardNotification, index) => {
            expect(vCardNotification.exists()).toBeTruthy();
            expect(findNotificationDate(vCardNotification).text()).toBe(dates[index].expect);
          });
        });

        it("should show an empty state when there are no notifications", async () => {
          await wrapper.setProps({ notifications: [] });

          const vBtn = findVBtn(wrapper);
          await vBtn.trigger("click");

          const vCard = findVCard(wrapper);
          expect(findVCardNotifications(vCard)).toHaveLength(0);
          expect(vCard.text()).toContain("Nenhuma notificação");
        });
      });
    });

    describe("navigation", () => {
      const navigation = true;

      it("should not render nav icon by default", () => {
        const vAppBarNavIcon = findVAppBarNavIcon(wrapper);
        expect(vAppBarNavIcon.exists()).toBeFalsy();
      });

      it("should render nav icon when navigation prop is set", async () => {
        await wrapper.setProps({ navigation });

        const vAppBarNavIcon = findVAppBarNavIcon(wrapper);
        expect(vAppBarNavIcon.exists()).toBeTruthy();
        expect(vAppBarNavIcon.attributes("data-testid")).toBe(`${testId}-navigation`);
      });

      it("should emit update:navigationOpen with inverted value when icon is clicked", async () => {
        await wrapper.setProps({ navigationOpen: true, navigation });

        const vAppBarNavIcon = findVAppBarNavIcon(wrapper);
        await vAppBarNavIcon.trigger("click");

        expect(wrapper.emitted("update:navigationOpen")?.[0]).toEqual([false]);
      });

      it("should emit update:navigationOpen true when toggling from false to true", async () => {
        await wrapper.setProps({ navigationOpen: false, navigation });

        const vAppBarNavIcon = findVAppBarNavIcon(wrapper);
        await vAppBarNavIcon.trigger("click");

        expect(wrapper.emitted("update:navigationOpen")?.[0]).toEqual([true]);
      });
    });

    describe("logo", () => {
      it("should render an image", async () => {
        const logo = "/logo.svg";

        let vImg = findVImg(wrapper);
        expect(vImg.exists()).toBeFalsy();

        await wrapper.setProps({ logo });

        vImg = findVImg(wrapper);
        expect(vImg.exists()).toBeTruthy();
        expect(vImg.props("cover")).toBeTruthy();
        expect(vImg.props("src")).toBe(logo);
        expect(vImg.props("height")).toBe("100%");
        expect(vImg.props("width")).toBe("fit-content");
        expect(vImg.props("class")).toContain("py-2 ml-5 mr-n3");
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
              <slot name="prepend" />
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

function findVImg(wrapper: ReturnType<typeof mountAppBar>) {
  return wrapper.findComponent(VImg);
}

function findVAppBarTitle(wrapper: ReturnType<typeof mountAppBar>) {
  return wrapper.findComponent(VAppBarTitle);
}

function findVAppBarNavIcon(wrapper: ReturnType<typeof mountAppBar>) {
  return wrapper.findComponent(VAppBarNavIcon);
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

function findVBadge(wrapper: ReturnType<typeof mountAppBar>) {
  return wrapper.findComponent(VBadge);
}

function findVCardNotifications(vCard: ReturnType<typeof findVCard>) {
  return vCard.findAllComponents(VListItem);
}

function findNotificationDate(
  vCardNotification: ReturnType<typeof findVCardNotifications>[number],
) {
  return vCardNotification.find(".opacity-60");
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
