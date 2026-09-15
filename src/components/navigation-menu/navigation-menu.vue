<template>
  <v-navigation-drawer v-model="open" :data-testid="props.dataTestid" absolute temporary>
    <template #prepend>
      <div class="px-4 pt-2">
        <text-field v-model="search" type="search" label="Buscar" :data-testid="searchDataTestid" />
      </div>
    </template>

    <v-divider />

    <v-list nav>
      <template v-for="(item, index) in filteredItems" :key="index">
        <template v-if="isParentItem(item)">
          <v-list-group>
            <template #activator="{ props: activatorProps }">
              <v-list-item v-bind="activatorProps" :title="item.description" />
            </template>

            <v-list-item
              v-for="(childItem, childIndex) in item.items"
              :key="childIndex"
              v-bind="routeToProps(childItem.route)"
              :title="childItem.description"
              @click="childItem.action"
            />
          </v-list-group>
        </template>

        <v-list-item
          v-else
          :title="item.description"
          v-bind="routeToProps(item.route)"
          @click="item.action"
        />
      </template>
    </v-list>
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
import TextField from "@/components/inputs/text-field/text-field.vue";
import { VNavigationDrawer, VList, VListItem, VListGroup, VDivider } from "vuetify/components";
import { computed, ref } from "vue";

const props = defineProps<NavigationMenuProps>();
const open = defineModel<boolean>({ default: false });
const search = ref("");

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
