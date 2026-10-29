<template>
  <v-navigation-drawer
    v-model="drawerOpen"
    color="tertiary"
    :data-testid="props.dataTestid"
    :aria-busy="props.loading || undefined"
    :mobile="mobile"
    :permanent="!mobile"
    :rail="!mobile"
    expand-on-hover
    temporary
    :order="layoutOrder"
    @focusin="onFocusin"
    @focusout="onFocusout"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
    @keydown.esc="dismiss"
  >
    <template #prepend>
      <div v-show="!collapsed" class="px-4 pb-4">
        <!-- Hides the empty messages area, which made the expanded rail's search taller than the
        collapsed one's search item and pushed the items down when the rail expanded -->
        <v-defaults-provider :defaults="searchFieldDefaults">
          <text-field
            ref="searchField"
            v-model="search"
            type="search"
            :placeholder="`Buscar (${shortcutLabel})`"
            :data-testid="searchDataTestid"
            :disabled="props.loading"
          />
        </v-defaults-provider>
      </div>

      <!-- Vuetify's list is focusable and passes the focus on to its first item: out of the tab
      order, the item gets the focus straight from the page, which then gets it back on `Esc` -->
      <v-list v-show="collapsed" nav role="group" tabindex="-1">
        <!-- Rendered as a native button, as the groups' headers (see below). Vuetify only styles
        a disabled item, and its button would still take the focus -->
        <v-list-item
          ref="searchItem"
          title="Buscar"
          :prepend-icon="icons.search"
          :disabled="props.loading"
          :tabindex="props.loading ? -1 : undefined"
          :aria-disabled="props.loading || undefined"
          :aria-keyshortcuts="ariaKeyshortcuts"
          :role="undefined"
          tag="button"
          type="button"
          class="w-100 text-start"
          @focus="onSearchItemFocus"
        />
      </v-list>
    </template>

    <v-divider />

    <skeleton-loader :loading="props.loading" type="list-item@6" color="tertiary">
      <!-- Vuetify's `list` role only allows list items, but the items are links.
      Vuetify makes the list the only tab stop and takes its items out of the tab order, for the arrow
      keys: the items are links and buttons, so each one is a tab stop instead (the arrow keys still
      move between them), and the list stays out of the tab order.
      `indent` aligns the items of a group with its title, which the 24px between the icons and
      the titles (`settings.scss`) move 8px to the left of Vuetify's default indentation. It
      replaces the group's prepend width too, so it's the icon (24px) plus that gap (24px) -->
      <v-list v-model:opened="opened" nav role="group" tabindex="-1" :indent="48">
        <template v-for="(item, index) in filteredItems" :key="index">
          <template v-if="isParentItem(item)">
            <v-list-group :value="item.description">
              <!-- Vuetify makes the group's header a list item, but it's a button that expands the
              group: rendered as one, without Vuetify's role, so the native role applies, and
              without the `aria-selected` Vuetify gives it for the group's value, which buttons
              don't take.
              A native button only takes its content's width and centers its text, so `w-100` and
              `text-start` make it as wide as the other items and aligned with them.
              Vuetify hides the highlight of an active group's header, except on the activatable
              groups of its tree view: their class shows the collapsed rail's group of the current
              page highlighted like the other items (the header is only active then) -->
              <template #activator="{ props: activatorProps, isOpen }">
                <v-list-item
                  v-bind="activatorProps"
                  :title="item.description"
                  :prepend-icon="icons[item.icon]"
                  :active="isActiveGroup(item)"
                  :aria-expanded="isOpen"
                  :aria-selected="undefined"
                  :role="undefined"
                  tabindex="0"
                  tag="button"
                  type="button"
                  class="w-100 text-start v-treeview-item--activatable-group-activator"
                />
              </template>

              <v-list-item
                v-for="(childItem, childIndex) in item.items"
                :key="childIndex"
                v-bind="routeToListItemProps(childItem.route)"
                :title="childItem.description"
                tabindex="0"
                @click="childItem.action"
              />
            </v-list-group>
          </template>

          <v-list-item
            v-else
            :title="item.description"
            :prepend-icon="icons[item.icon]"
            v-bind="routeToListItemProps(item.route)"
            tabindex="0"
            @click="item.action"
          />
        </template>
      </v-list>
    </skeleton-loader>
  </v-navigation-drawer>
</template>

<script lang="ts">
/**
 * Lateral navigation menu listing plain and/or grouped navigation items. Above the mobile
 * breakpoint, it's a rail showing only the items' icons, which expands over the page while the
 * mouse is over it, the keyboard focus is in it or the user searches. Below it, it's a drawer
 * opened by the app bar's button. It stays fixed on the screen while the page scrolls, between the
 * app bar and the footer, and only its items scroll when they don't fit.
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import {
  type NavigationMenuProps,
  type NavigationMenuParentItemOrItem,
} from "@/components/navigation-menu/types.ts";
import { routeToListItemProps } from "@/composables/navigation/use-route-props.ts";
import { icons } from "@/consts/icons.ts";
import TextField from "@/components/inputs/text-field/text-field.vue";
import SkeletonLoader from "@/components/skeleton-loader/skeleton-loader.vue";
import {
  VDefaultsProvider,
  VNavigationDrawer,
  VList,
  VListItem,
  VListGroup,
  VDivider,
} from "vuetify/components";
import { useNavigationSearchShortcut } from "@/composables/navigation/use-navigation-search-shortcut.ts";
import { isParentItem, useNavigationRail } from "@/composables/navigation/use-navigation-rail.ts";
import { computed, ref, useTemplateRef, watch, type ComponentPublicInstance } from "vue";

type Props = NavigationMenuProps & {
  loading?: boolean;
};

const props = defineProps<Props>();
// The app's bars are laid out in the order they're rendered, and the footer is rendered after the
// menu, which would then run beside it down to the bottom of the screen. Laid out after the footer,
// the menu ends above it
const layoutOrder = 1;
const open = defineModel<boolean>({ default: false });
const search = ref("");
const searchFieldDefaults = { VTextField: { hideDetails: "auto" } };
const field = useTemplateRef<ComponentPublicInstance>("searchField");
const {
  mobile,
  collapsed,
  drawerOpen,
  menuOpen,
  opened,
  isActiveGroup,
  dismiss,
  isRestoringFocus,
  onFocusin,
  onFocusout,
  onMouseenter,
  onMouseleave,
} = useNavigationRail({
  open,
  field,
  searchItem: useTemplateRef<ComponentPublicInstance>("searchItem"),
  items: () => props.items,
  search,
});
const {
  label: shortcutLabel,
  ariaKeyshortcuts,
  openSearch,
} = useNavigationSearchShortcut({ open: menuOpen, field });

const filteredItems = computed(() => filterItems());

function onSearchItemFocus(event: FocusEvent) {
  // The rail gives the item the focus when `Esc` hides the focused element, which isn't a search
  if (!isRestoringFocus()) void openSearch(event.relatedTarget);
}
const searchDataTestid = computed(() => `${props.dataTestid}-search`);
const query = computed(() => search.value.toLowerCase());

/** Groups open before the search started, which open again when it's cleared */
let groupsBeforeSearch = opened.value;

// While searching, every group with a match opens, so its matching items show. Each change to the
// text opens them again, even one the user closed, and clearing it brings back the groups that were
// open before the search
watch(query, (text, previous) => {
  if (!previous) groupsBeforeSearch = opened.value;
  opened.value = text
    ? filteredItems.value.filter(isParentItem).map(({ description }) => description)
    : groupsBeforeSearch;
});

function filterItems(): Array<NavigationMenuParentItemOrItem> {
  const items = props.items ?? [];
  return items.reduce<Array<NavigationMenuParentItemOrItem>>((filtered, item) => {
    if (matches(item)) {
      filtered.push(item);
    } else if (isParentItem(item)) {
      const matchingChildren = item.items.filter((child) => matches(child));
      if (matchingChildren.length) filtered.push({ ...item, items: matchingChildren });
    }

    return filtered;
  }, []);
}

function matches(item: { description: string }): boolean {
  return item.description.toLowerCase().includes(query.value);
}
</script>
