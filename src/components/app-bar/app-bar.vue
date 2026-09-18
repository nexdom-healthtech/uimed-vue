<template>
  <v-app-bar :data-testid="props.dataTestid">
    <v-app-bar-nav-icon
      v-if="navigation"
      :data-testid="navigationBtnDataTestid"
      @click="navigationOpen = !navigationOpen"
    />

    <v-img
      v-if="logo"
      :src="props.logo"
      height="100%"
      width="fit-content"
      class="py-2 ml-5 mr-n3"
      cover
    />

    <v-app-bar-title v-if="props.title">{{ props.title }}</v-app-bar-title>

    <template #append>
      <v-btn
        v-if="showHelp"
        v-bind="routeProps"
        :data-testid="helpBtnDataTestid"
        icon="mdi-help-circle-outline"
      />
      <v-menu v-if="showNotifications" v-model="notificationsOpen" :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn v-bind="props" :data-testid="notificationsBtnDataTestid" icon>
            <v-badge :model-value="hasUnreadNotifications" :content="unreadCount" color="error">
              <v-icon icon="mdi-bell-outline" />
            </v-badge>
          </v-btn>
        </template>

        <v-card :data-testid="notificationsMenuDataTestid">
          <v-list v-if="props.notifications?.length">
            <v-list-subheader>Notificações</v-list-subheader>

            <template v-for="(notification, index) in props.notifications" :key="index">
              <v-list-item
                :active="!notification.read"
                :title="notification.title"
                :subtitle="notification.subtitle"
                active-class="text-primary"
              >
                <template v-if="notification.date" #append>
                  <v-list-item-action end>
                    <small class="opacity-60">
                      {{ formatNotificationDate(notification.date) }}
                    </small>
                  </v-list-item-action>
                </template>
              </v-list-item>
            </template>
          </v-list>
          <v-card-text v-else>Nenhuma notificação</v-card-text>
        </v-card>
      </v-menu>
      <v-menu v-if="showUser" :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn v-bind="props" :data-testid="userBtnDataTestid" icon>
            <v-avatar v-bind="userAvatarProps" color="primary" />
          </v-btn>
        </template>

        <v-card :title="user?.title" :subtitle="user?.subtitle" :data-testid="userMenuDataTestid">
          <template #prepend>
            <v-avatar v-bind="userAvatarProps" color="primary" />
          </template>

          <v-divider />

          <v-list nav>
            <template v-for="(option, index) in props.user?.options" :key="index">
              <v-divider v-if="index > 0" class="mt-1" />

              <template v-if="isParentOption(option)">
                <v-list-group>
                  <template #activator="{ props }">
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
import { formatDateTime, toPeriodInterval } from "@nexdom/shared/utils";
import { computed } from "vue";
import {
  VAppBar,
  VAppBarTitle,
  VAppBarNavIcon,
  VBtn,
  VMenu,
  VCard,
  VCardText,
  VAvatar,
  VBadge,
  VIcon,
  VDivider,
  VImg,
  VList,
  VListItem,
  VListGroup,
  VListSubheader,
  VListItemAction,
} from "vuetify/components";

type Props = AppBarProps & {
  navigation?: boolean;
  logo?: string;
};

const props = defineProps<Props>();
const notificationsOpen = defineModel<boolean>("notificationsOpen", { default: false });
const navigationOpen = defineModel<boolean>("navigationOpen");

const helpBtnDataTestid = computed(() => `${props.dataTestid}-help`);
const notificationsBtnDataTestid = computed(() => `${props.dataTestid}-notifications`);
const navigationBtnDataTestid = computed(() => `${props.dataTestid}-navigation`);
const notificationsMenuDataTestid = computed(() => `${props.dataTestid}-notifications-menu`);
const userBtnDataTestid = computed(() => `${props.dataTestid}-user`);
const userMenuDataTestid = computed(() => `${props.dataTestid}-user-menu`);

const showHelp = computed(() => !!props.help);
const routeProps = useRouteProps(() => props.help);

const showNotifications = computed(() => !!props.notifications);
const unreadCount = computed(
  () => props.notifications!.filter((notification) => !notification.read).length,
);
const hasUnreadNotifications = computed(() => unreadCount.value > 0);

const showUser = computed(() => !!props.user);
const userAvatarProps = computed(() =>
  props.user!.img ? { image: props.user!.img } : { icon: "mdi-account-outline" },
);

function isParentOption(option: ParentOptionOrOption): option is ParentOption {
  return "items" in option;
}

function formatNotificationDate(date: Date) {
  const interval = toPeriodInterval(date);

  if (wasThisMonth(interval)) {
    if (wasToday(interval)) return formatDateTime(date, "HH:mm");
    else if (wasYesterday(interval)) return "Ontem";
  }

  return formatDateTime(date, "DD/MM/YYYY");
}

function wasThisMonth(interval: ReturnType<typeof toPeriodInterval>) {
  return interval.months === 0 && interval.years === 0;
}

function wasToday(interval: ReturnType<typeof toPeriodInterval>) {
  return interval.days === 0;
}

function wasYesterday(interval: ReturnType<typeof toPeriodInterval>) {
  return interval.days === 1;
}
</script>
