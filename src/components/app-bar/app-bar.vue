<template>
  <v-app-bar :title="props.title" :data-testid="props.dataTestid">
    <template #append>
      <v-btn v-if="showHelp" v-bind="routeProps" icon="mdi-help-circle-outline" />
    </template>
  </v-app-bar>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { type AppBarProps } from "@/components/app-bar/types.ts";
import useRouteProps from "@/composables/navigation/use-route-props.ts";
import { computed } from "vue";
import { VAppBar, VBtn } from "vuetify/components";

const props = defineProps<AppBarProps>();

const showHelp = computed(() => !!props.help);
const routeProps = useRouteProps(() => props.help);
</script>
