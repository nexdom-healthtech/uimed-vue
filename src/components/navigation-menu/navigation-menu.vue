<template>
  <v-navigation-drawer
    v-model="open"
    color="primary"
    :data-testid="props.dataTestid"
    :aria-busy="props.loading || undefined"
    absolute
    temporary
    @keydown.esc="close"
  >
    <template #prepend>
      <div class="px-4 pt-2">
        <text-field
          ref="searchField"
          v-model="search"
          type="search"
          :placeholder="`Buscar (${shortcutLabel})`"
          :data-testid="searchDataTestid"
          :disabled="props.loading"
        />
      </div>
    </template>

    <v-divider />

    <v-skeleton-loader :loading="props.loading" type="list-item@6" color="primary">
      <v-list nav>
        <template v-for="(item, index) in filteredItems" :key="index">
          <template v-if="isParentItem(item)">
            <v-list-group>
              <template #activator="{ props: activatorProps }">
                <v-list-item
                  v-bind="activatorProps"
                  :title="item.description"
                  :prepend-icon="item.icon && iconToVuetifyIcon[item.icon]"
                />
              </template>

              <v-list-item
                v-for="(childItem, childIndex) in item.items"
                :key="childIndex"
                v-bind="routeToProps(childItem.route)"
                :title="childItem.description"
                :prepend-icon="childItem.icon && iconToVuetifyIcon[childItem.icon]"
                @click="childItem.action"
              />
            </v-list-group>
          </template>

          <v-list-item
            v-else
            :title="item.description"
            :prepend-icon="item.icon && iconToVuetifyIcon[item.icon]"
            v-bind="routeToProps(item.route)"
            @click="item.action"
          />
        </template>
      </v-list>
    </v-skeleton-loader>
  </v-navigation-drawer>
</template>

<script lang="ts">
/**
 * Lateral navigation menu, rendered as a drawer, listing plain and/or grouped
 * navigation items.
 */
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import {
  type NavigationMenuProps,
  type NavigationMenuParentItem,
  type NavigationMenuParentItemOrItem,
} from "@/components/navigation-menu/types.ts";
import { routeToProps } from "@/composables/navigation/use-route-props.ts";
import { iconToVuetifyIcon } from "@/consts/icons.ts";
import TextField from "@/components/inputs/text-field/text-field.vue";
import {
  VNavigationDrawer,
  VList,
  VListItem,
  VListGroup,
  VDivider,
  VSkeletonLoader,
} from "vuetify/components";
import { useNavigationSearchShortcut } from "@/composables/navigation/use-navigation-search-shortcut.ts";
import { computed, ref, useTemplateRef, type ComponentPublicInstance } from "vue";

type Props = NavigationMenuProps & {
  loading?: boolean;
};

const props = defineProps<Props>();
const open = defineModel<boolean>({ default: false });
const search = ref("");
const { label: shortcutLabel, close } = useNavigationSearchShortcut({
  open,
  field: useTemplateRef<ComponentPublicInstance>("searchField"),
});

const filteredItems = computed(() => filterItems());
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

function matches(item: NavigationMenuParentItemOrItem): boolean {
  return item.description.toLowerCase().includes(query.value);
}

function isParentItem(item: NavigationMenuParentItemOrItem): item is NavigationMenuParentItem {
  return "items" in item;
}
</script>
