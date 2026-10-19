<template>
  <u-container full-height data-testid="second-page">
    <u-row full-height align-y="center" align-x="center">
      <u-column cols="auto">
        <u-section title="Agenda" :actions="actions">
          <u-section-content>Consultas agendadas para hoje.</u-section-content>
        </u-section>
      </u-column>
    </u-row>
  </u-container>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import type { ComponentProps } from "vue-component-type-helpers";
import {
  UColumn,
  UContainer,
  URow,
  USection,
  USectionContent,
} from "../../../../../dist/components.js";

const router = useRouter();

const actions: ComponentProps<typeof USection>["actions"] = [
  { label: "Voltar aos pacientes", onClick: () => router.push("/") },
];
</script>
