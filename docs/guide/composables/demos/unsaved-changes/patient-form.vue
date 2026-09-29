<template>
  <u-section title="Cadastro do paciente" :actions="actions" data-testid="patient-form">
    <u-section-content>
      <u-text-field v-model="form.name" label="Nome" data-testid="name-field" />
      <p data-testid="has-changes">Alterações não salvas: {{ hasChanges ? "sim" : "não" }}</p>
    </u-section-content>
  </u-section>
</template>

<script lang="ts">
import { ref } from "vue";

/** Last saved patient, kept while the demo switches between its pages. */
const saved = ref({ name: "Maria Silva" });
</script>

<script lang="ts" setup>
import { computed, toRaw } from "vue";
import { useRouter } from "vue-router";
import type { ComponentProps } from "vue-component-type-helpers";
import { USection, USectionContent, UTextField } from "../../../../../dist/components.js";
import { useUnsavedChanges } from "../../../../../dist/composables.js";

const router = useRouter();
const form = ref(structuredClone(toRaw(saved.value)));
const { hasChanges } = useUnsavedChanges({ previous: saved, current: form });

function save() {
  saved.value = structuredClone(toRaw(form.value));
}

async function saveAndLeave() {
  save();
  await router.push("/pacientes");
}

const actions = computed<ComponentProps<typeof USection>["actions"]>(() => [
  { label: "Ir para a lista", variant: "ghost", onClick: () => router.push("/pacientes") },
  { label: "Salvar", variant: "secondary", disabled: !hasChanges.value, onClick: save },
  { label: "Salvar e ir para a lista", onClick: saveAndLeave },
]);
</script>
