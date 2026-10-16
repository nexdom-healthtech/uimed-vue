<template>
  <v-app-bar :data-testid="props.dataTestid" :aria-busy="props.loading || undefined">
    <v-app-bar-nav-icon
      v-if="navigation"
      :data-testid="navigationBtnDataTestid"
      :aria-expanded="navigationOpen"
      aria-label="Menu de navegação"
      :aria-keyshortcuts="navigationKeyshortcuts"
      @click="navigationOpen = !navigationOpen"
    />

    <v-img
      v-if="logo"
      :src="props.logo"
      alt=""
      height="100%"
      width="fit-content"
      class="py-2 ml-5 mr-n3"
      cover
    />

    <v-app-bar-title v-if="props.title" role="heading" aria-level="1">
      {{ props.title }}
    </v-app-bar-title>

    <template #append>
      <skeleton-loader :loading="props.loading" type="avatar">
        <v-btn
          v-if="showHelp"
          v-bind="routeProps"
          :data-testid="helpBtnDataTestid"
          aria-label="Ajuda"
          :icon="icons.help"
        />
        <v-menu
          v-if="showNotifications"
          v-model="notificationsOpen"
          :close-on-content-click="false"
        >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              :data-testid="notificationsBtnDataTestid"
              :aria-label="notificationsLabel"
              icon
            >
              <v-badge
                :model-value="hasUnreadNotifications"
                :content="unreadCount"
                :label="unreadLabel"
                color="error"
              >
                <v-icon :icon="icons.notifications" />
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
                  active-class="text-primary-text"
                >
                  <!-- Only the unread notifications' title is green: the subtitle's lower opacity
                  would take the green below WCAG AA's contrast, so it keeps the theme's text color.
                  No prop sets the subtitle's color -->
                  <template #subtitle="{ subtitle }">
                    <span class="text-high-emphasis">{{ subtitle }}</span>
                  </template>
                  <template v-if="notification.when" #append>
                    <v-list-item-action end>
                      <!-- No prop sets the secondary text color, which follows the theme's contrast -->
                      <small class="text-medium-emphasis">
                        {{ notification.when }}
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
            <v-btn
              v-bind="props"
              :data-testid="userBtnDataTestid"
              aria-label="Menu do usuário"
              icon
            >
              <!-- Decorative: the button already has an accessible name -->
              <v-avatar v-bind="userAvatarProps" color="primary" aria-hidden="true" />
            </v-btn>
          </template>

          <v-card :title="user?.title" :subtitle="user?.subtitle" :data-testid="userMenuDataTestid">
            <template #prepend>
              <!-- Decorative: the user's name, when given, is already the card's title -->
              <v-avatar v-bind="userAvatarProps" color="primary" aria-hidden="true" />
            </template>

            <v-divider />

            <!-- Vuetify's `list` role only allows list items, but the options are links and
            separators -->
            <v-list nav role="group">
              <template v-for="(option, index) in props.user?.options" :key="index">
                <v-divider v-if="index > 0" class="mt-1" />

                <template v-if="isParentOption(option)">
                  <v-list-group>
                    <!-- Vuetify makes the group's header a list item, but it's a button that expands
                    the group: rendered as one, without Vuetify's role, so the native role applies -->
                    <template #activator="{ props, isOpen }">
                      <v-list-item
                        v-bind="props"
                        :title="option.description"
                        :aria-expanded="isOpen"
                        :role="undefined"
                        tag="button"
                        type="button"
                      />
                    </template>

                    <v-list-item
                      v-for="(childOption, index) in option.items"
                      :key="index"
                      v-bind="routeToListItemProps(childOption.route)"
                      :title="childOption.description"
                      @click="childOption.action"
                    />
                  </v-list-group>
                </template>

                <v-list-item
                  v-else
                  :title="option.description"
                  v-bind="routeToListItemProps(option.route)"
                  @click="option.action"
                />
              </template>
            </v-list>
          </v-card>
        </v-menu>
      </skeleton-loader>
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
import useRouteProps, { routeToListItemProps } from "@/composables/navigation/use-route-props.ts";
import { useNavigationShortcutKeys } from "@/composables/navigation/use-navigation-search-shortcut.ts";
import { computed, watch } from "vue";
import { toInitials } from "@nexdom/shared/utils";
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
import SkeletonLoader from "@/components/skeleton-loader/skeleton-loader.vue";
import { icons } from "@/consts/icons.ts";

type Props = AppBarProps & {
  navigation?: boolean;
  logo?: string;
  loading?: boolean;
};

const props = defineProps<Props>();
const notificationsOpen = defineModel<boolean>("notificationsOpen", { default: false });
const navigationOpen = defineModel<boolean>("navigationOpen");
// Ctrl+K (⌘K on macOS) also opens the navigation menu, handled by the menu itself
const { ariaKeyshortcuts: navigationKeyshortcuts } = useNavigationShortcutKeys();

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
const unreadLabel = computed(() =>
  unreadCount.value === 1 ? "1 não lida" : `${unreadCount.value} não lidas`,
);
const notificationsLabel = computed(() =>
  hasUnreadNotifications.value ? `Notificações (${unreadLabel.value})` : "Notificações",
);

// The notifications menu unmounts while loading; closing it keeps it from reopening afterwards
watch(
  () => props.loading,
  (loading) => {
    if (loading) notificationsOpen.value = false;
  },
);

const showUser = computed(() => !!props.user);
const userInitials = computed(() => toInitials(props.user!.title ?? ""));
// The picture comes first, then the initials of the user's name, and the generic icon last
const userAvatarProps = computed(() => {
  if (props.user!.img) return { image: props.user!.img };
  if (userInitials.value) return { text: userInitials.value };
  return { icon: icons["account-alternative"] };
});

function isParentOption(option: ParentOptionOrOption): option is ParentOption {
  return "items" in option;
}
</script>
