/**
 * Value that identifies a tab and pairs it with its content.
 */
export type TabsValue = string | number;

/**
 * A tab of the {@link UTabs} component.
 */
export type TabsItem = {
  /**
   * Text displayed on the tab.
   */
  title: string;

  /**
   * Value that identifies the tab, set on the `v-model` when it's selected,
   * and pairs it with the `UTabsItem` of the same `value`. Without it, the tab
   * takes its position, starting at 0. Must be unique among the tabs, and
   * set on all of them or on none.
   */
  value?: TabsValue;
};

/**
 * Props exposed by the {@link UTabs} component.
 */
export type TabsProps = {
  /**
   * Tabs to display, in order.
   */
  items: TabsItem[];

  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;
};

/**
 * Props exposed by the {@link UTabsContent} component.
 */
export type TabsContentProps = {
  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;
};

/**
 * Props exposed by the {@link UTabsItem} component.
 */
export type TabsItemProps = {
  /**
   * Value of the tab whose content this is, the same as the tab's `value` in
   * the `UTabs` items. Without it, the content takes its position, starting at
   * 0. Must be unique among the contents.
   */
  value?: TabsValue;

  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;
};
