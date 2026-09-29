# Alterações não salvas

Uma vez que carregamos o [Componente base](../components/main), podemos estar tirando proveito da nossa composable para evitar que o usuário perca as alterações de um formulário ao sair da página sem salvar.

A composable compara o valor original do formulário (`previous`) com o valor atual (`current`) e informa, por meio de `hasChanges`, se existem alterações. Enquanto existirem alterações:

- sair da página pelo [Vue Router](https://router.vuejs.org/) apresenta um diálogo de [confirmação](./use-confirm);
- recarregar a página, fechar a aba ou sair da aplicação por um link externo apresenta o aviso do próprio navegador.

## Uso

Edite o nome do paciente e tente ir para a lista.

<demo col>
  <u-main>
    <router-view />
  </u-main>
</demo>

A demonstração tem duas páginas, "Cadastro do paciente" e "Pacientes", com um roteador próprio. Por isso, a navegação entre elas não altera o endereço do navegador.

```vue
<!-- PatientForm.vue, página renderizada pelo <RouterView> -->
<template>
  <u-section title="Cadastro do paciente" :actions="actions">
    <u-section-content>
      <u-text-field v-model="form.name" label="Nome" />
      <p>Alterações não salvas: {{ hasChanges ? "sim" : "não" }}</p>
    </u-section-content>
  </u-section>
</template>

<script lang="ts" setup>
import { computed, ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import type { ComponentProps } from "vue-component-type-helpers";
import { USection, USectionContent, UTextField } from "@nexdom/uimed-vue/components";
import { useUnsavedChanges } from "@nexdom/uimed-vue/composables";

const router = useRouter();
const saved = ref({ name: "Maria Silva" });
const form = ref(structuredClone(toRaw(saved.value)));
const { hasChanges } = useUnsavedChanges({ previous: saved, current: form });

function save() {
  // Marca o formulário como salvo
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
```

### Comparação dos valores

`previous` e `current` aceitam uma `ref`, um getter (`() => valor`) ou um objeto `reactive`. A comparação é feita em profundidade:

- a ordem das propriedades não importa;
- uma propriedade com `undefined` é igual a uma propriedade ausente;
- datas (`Date`) são comparadas pelo horário;
- listas são comparadas item a item, na mesma ordem;
- `null`, `""` e `undefined` são diferentes entre si, então limpar um campo que era `null` conta como alteração;
- objetos simples (como `{ nome: "Maria" }`) são comparados propriedade a propriedade;
- os demais objetos, como `File`, `Blob`, `Map`, `Set` e instâncias de classes, são comparados por referência: trocar um anexo por outro `File` conta como alteração, mesmo que o conteúdo seja igual;
- os demais valores são comparados com [`Object.is`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/is), então `NaN` é igual a `NaN`.

### Saindo da página

Com alterações, sair da página pelo Vue Router apresenta o diálogo "Alterações não salvas", com o foco inicial em "Continuar editando":

- "Sair sem salvar" continua a navegação;
- "Continuar editando", a tecla `Esc` ou um clique fora do diálogo cancelam a navegação, e o usuário continua na página com as suas alterações.

Sem alterações, a navegação acontece sem diálogo. Em aplicações com Vue Router e histórico do navegador (`createWebHistory` ou `createWebHashHistory`), o botão "voltar" do navegador também passa pela mesma verificação: ao cancelar, o endereço volta a ser o da página atual.

Enquanto o diálogo estiver aberto, novas navegações não abrem outro diálogo: a resposta vale para a navegação mais recente. Por exemplo, em aplicações com Vue Router e histórico do navegador (`createWebHistory` ou `createWebHashHistory`), se o usuário usar o botão "voltar" do navegador com o diálogo aberto, o diálogo continua aberto; "Sair sem salvar" leva à página anterior e "Continuar editando" mantém o usuário na página. Esse comportamento difere do [`confirm`](./use-confirm), cujo diálogo fecha com o "voltar".

Se a página tiver mais de um componente usando `useUnsavedChanges` com alterações, cada um apresenta o seu diálogo, um depois do outro.

### Depois de salvar

Para marcar o formulário como salvo, atribua a `previous` uma cópia do valor atual, como no `save` do exemplo. A partir daí, `hasChanges` volta a ser `false` e a navegação seguinte acontece sem diálogo, mesmo que ela seja feita logo em seguida, como no "Salvar e ir para a lista".

::: warning Atenção
Use uma cópia (por exemplo, com `structuredClone(toRaw(valor))`). Se `previous` e `current` apontarem para o mesmo objeto, as alterações de um também aparecem no outro e `hasChanges` fica sempre `false`.
:::

### Recarregando ou fechando a aba

Com alterações, recarregar a página (F5), fechar a aba ou sair da aplicação por um link externo apresenta o aviso do próprio navegador. O texto desse aviso é definido pelo navegador e não pode ser personalizado, e ele só aparece se o usuário já interagiu com a página (por exemplo, digitando em um campo).

O aviso só é registrado enquanto houver alterações. Para desligá-lo, use a opção `beforeUnload: false`.

```ts
const { hasChanges } = useUnsavedChanges(
  { previous: saved, current: form },
  { beforeUnload: false },
);
```

### Personalizando o diálogo

Os textos e a cor do botão de confirmação aceitam as mesmas opções do [`confirm`](./use-confirm).

```ts
const { hasChanges } = useUnsavedChanges(
  { previous: saved, current: form },
  {
    title: "Descartar cadastro",
    message: "O cadastro do paciente ainda não foi salvo. Deseja descartá-lo?",
    confirmText: "Descartar",
    cancelText: "Voltar ao cadastro",
    color: "caution",
  },
);
```

### Limitações

- O diálogo depende do [Componente base](../components/main): sem ele, o diálogo não aparece e a navegação fica pendente.
- A navegação só é verificada quando `useUnsavedChanges` é chamada em uma página renderizada pelo `<RouterView>` (ou em um componente dentro dela). Em outros lugares, ou em aplicações sem Vue Router, apenas `hasChanges` e o aviso do navegador funcionam.
- Mudanças apenas nos parâmetros (`params`) ou na consulta (`query`) da mesma rota não são verificadas.

## Ver também

- Consulte a referência de [API do useUnsavedChanges](../../api/composables/use-unsaved-changes) para mais informações.
- Para pedir a confirmação do usuário antes de executar uma ação, use a composable [useConfirm](./use-confirm).

<script lang="ts" setup>
  import { onMounted, provide } from "vue";
  import {
    createMemoryHistory,
    createRouter,
    RouterView,
    routerKey,
    routerViewLocationKey,
  } from "vue-router";
  import { UMain } from "../../../dist/components.js";
  import PatientForm from "./demos/unsaved-changes/patient-form.vue";
  import PatientList from "./demos/unsaved-changes/patient-list.vue";

  // Router restricted to the demo, so it doesn't change the browser's address nor the other demos
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component: PatientForm },
      { path: "/pacientes", component: PatientList },
    ],
  });

  // Only what the demo uses is provided. Without `routeLocationKey`, `useRoute()` and `RouterLink`
  // don't work inside it
  provide(routerKey, router);
  provide(routerViewLocationKey, router.currentRoute);
  onMounted(() => router.replace("/"));
</script>
