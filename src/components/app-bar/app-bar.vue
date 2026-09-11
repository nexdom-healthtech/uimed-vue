<template>
  <v-app-bar :title="props.title" :data-testid="props.dataTestid">
    <template #append>
      <v-btn
        v-if="showHelp"
        v-bind="routeProps"
        :data-testid="helpBtnDataTestid"
        icon="mdi-help-circle-outline"
      />
      <v-menu v-if="showUser" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" :data-testid="userBtnDataTestid" icon>
            <v-avatar v-bind="userAvatarProps" color="primary" />
          </v-btn>
        </template>

        <v-card :title="user?.title" :subtitle="user?.subtitle" :data-testid="userMenuDataTestid">
          <template v-slot:prepend>
            <v-avatar v-bind="userAvatarProps" color="primary" />
          </template>

          <v-divider />

          <v-list nav>
            <template v-for="(option, index) in props.user?.options" :key="index">
              <v-divider v-if="index > 0" class="mt-1" />

              <template v-if="isParentOption(option)">
                <v-list-group>
                  <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" :title="option.description" />
                  </template>

                  <v-list-item
                    v-for="(childOption, index) in option.items"
                    :key="index"
                    v-bind="routeToProps(childOption.route)"
                    :title="childOption.description"
                    @click="childOption.action"
                  />
                </v-list-group>
              </template>

              <v-list-item
                v-else
                :title="option.description"
                v-bind="routeToProps(option.route)"
                @click="option.action"
              />
            </template>
          </v-list>
        </v-card>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import {
  type AppBarProps,
  type ParentOption,
  type ParentOptionOrOption,
} from "@/components/app-bar/types.ts";
import useRouteProps, { routeToProps } from "@/composables/navigation/use-route-props.ts";
import { computed } from "vue";
import {
  VAppBar,
  VBtn,
  VMenu,
  VCard,
  VAvatar,
  VDivider,
  VList,
  VListItem,
  VListGroup,
} from "vuetify/components";

const props = defineProps<AppBarProps>();

const helpBtnDataTestid = computed(() => `${props.dataTestid}-help`);
const userBtnDataTestid = computed(() => `${props.dataTestid}-user`);
const userMenuDataTestid = computed(() => `${props.dataTestid}-user-menu`);

const showHelp = computed(() => !!props.help);
const routeProps = useRouteProps(() => props.help);

const showUser = computed(() => !!props.user);
const userAvatarProps = computed(() =>
  props.user!.img ? { image: props.user!.img } : { icon: "mdi-account-outline" },
);

function isParentOption(option: ParentOptionOrOption): option is ParentOption {
  return "items" in option;
}
</script>
