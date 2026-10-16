<template>
  <u-section title="Pacientes" :actions="actions" data-testid="patient-list">
    <u-section-content>Lista de pacientes cadastrados.</u-section-content>
  </u-section>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import type { ComponentProps } from "vue-component-type-helpers";
import { USection, USectionContent } from "../../../../../dist/components.js";

const router = useRouter();

const actions: ComponentProps<typeof USection>["actions"] = [
  { label: "Voltar ao cadastro", onClick: () => router.push("/") },
];
</script>
