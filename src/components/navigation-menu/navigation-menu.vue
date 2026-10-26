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
    absolute
    temporary
    @focusin="onFocusin"
    @focusout="onFocusout"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
    @keydown.esc="dismiss"
  >
    <template #prepend>
      <div v-show="!collapsed" class="px-4 pt-2">
        <text-field
          ref="searchField"
          v-model="search"
          type="search"
          :placeholder="`Buscar (${shortcutLabel})`"
          :data-testid="searchDataTestid"
          :disabled="props.loading"
        />
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
      <!-- Vuetify's `list` role only allows list items, but the items are links -->
      <v-list v-model:opened="opened" nav role="group">
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
                @click="childItem.action"
              />
            </v-list-group>
          </template>

          <v-list-item
            v-else
            :title="item.description"
            :prepend-icon="icons[item.icon]"
            v-bind="routeToListItemProps(item.route)"
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
 * opened by the app bar's button.
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
import { VNavigationDrawer, VList, VListItem, VListGroup, VDivider } from "vuetify/components";
import { useNavigationSearchShortcut } from "@/composables/navigation/use-navigation-search-shortcut.ts";
import { isParentItem, useNavigationRail } from "@/composables/navigation/use-navigation-rail.ts";
import { computed, ref, useTemplateRef, type ComponentPublicInstance } from "vue";

type Props = NavigationMenuProps & {
  loading?: boolean;
};

const props = defineProps<Props>();
const open = defineModel<boolean>({ default: false });
const search = ref("");
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
