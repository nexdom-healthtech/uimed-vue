# useUnsavedChanges

Composable para evitar a perda de alterações não salvas de um formulário ao sair da página.

## Tipo

```ts
type ColorVariant = "primary" | "secondary" | "positive" | "informative" | "caution" | "danger";

interface UnsavedChangesValues<T> {
  previous: import("vue").MaybeRefOrGetter<T>;
  current: import("vue").MaybeRefOrGetter<T>;
}

interface UnsavedChangesOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  color?: ColorVariant;
  beforeUnload?: boolean;
}

function useUnsavedChanges<T>(
  values: UnsavedChangesValues<T>,
  options?: UnsavedChangesOptions,
): {
  hasChanges: import("vue").ComputedRef<boolean>;
};
```

## Detalhes

Deve ser chamada no `setup` de um componente. Retorna uma [`computed`](https://vuejs.org/guide/essentials/computed.html) somente leitura (`hasChanges`), que é `true` enquanto o valor original (`previous`) e o valor atual (`current`) forem diferentes.

`previous` e `current` aceitam uma `ref`, um getter ou um objeto `reactive`, e são comparados em profundidade:

- a ordem das propriedades não importa;
- uma propriedade com `undefined` é igual a uma propriedade ausente;
- datas (`Date`) são comparadas pelo horário;
- listas são comparadas item a item, na mesma ordem;
- objetos simples (literais ou sem protótipo) são comparados propriedade a propriedade;
- os demais objetos, como `File`, `Blob`, `Map`, `Set` e instâncias de classes, são comparados por referência;
- os demais valores são comparados com [`Object.is`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/is), então `null`, `""` e `undefined` são diferentes entre si e `NaN` é igual a `NaN`.

Para marcar o formulário como salvo, atribua a `previous` uma cópia do valor atual. Se `previous` e `current` apontarem para o mesmo objeto, `hasChanges` fica sempre `false`.

### Navegação

Quando o componente é renderizado por um `<RouterView>` do [Vue Router](https://router.vuejs.org/) (diretamente ou dentro de uma página), sair da página com alterações apresenta um diálogo de [confirmação](./use-confirm):

- "Sair sem salvar" continua a navegação;
- "Continuar editando", a tecla `Esc` ou um clique fora do diálogo cancelam a navegação.

`hasChanges` é lido no momento da navegação, então uma navegação feita logo depois de atualizar `previous` acontece sem diálogo. Enquanto o diálogo estiver aberto, novas navegações reaproveitam a mesma resposta, que vale para a navegação mais recente. Em aplicações com Vue Router e histórico do navegador (`createWebHistory` ou `createWebHashHistory`), o botão "voltar" do navegador passa pela mesma verificação e, com o diálogo aberto, não o fecha (ao contrário do [`useConfirm`](./use-confirm)): a resposta passa a valer para o "voltar". Cada chamada de `useUnsavedChanges` com alterações apresenta o seu diálogo.

A verificação é removida quando o componente é desmontado. Ela não acontece:

- fora de um `<RouterView>` ou em aplicações sem Vue Router;
- em mudanças apenas nos parâmetros (`params`) ou na consulta (`query`) da mesma rota.

O diálogo depende do [`UMain`](../components/main): sem ele, o diálogo não aparece e a navegação fica pendente.

### Aviso do navegador

Com `beforeUnload` ligado (padrão), recarregar a página, fechar a aba ou sair da aplicação por um link externo com alterações apresenta o aviso do próprio navegador. O texto é definido pelo navegador, e o aviso só aparece se o usuário já interagiu com a página. O aviso só é registrado enquanto houver alterações e é removido quando o componente é desmontado ou, dentro de um `<KeepAlive>`, desativado. Alterações feitas enquanto o componente está desativado (por exemplo, por uma requisição que termina depois que o usuário saiu da página) só registram o aviso quando ele é ativado de novo.

### `UnsavedChangesOptions`

| Opção          | Tipo                                                                                         | Padrão                                                                     | Descrição                                                                               |
| -------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `title`        | `string`                                                                                     | `"Alterações não salvas"`                                                  | Título do diálogo, em texto simples (HTML não é interpretado).                          |
| `message`      | `string`                                                                                     | `"Existem alterações que ainda não foram salvas. Deseja sair sem salvar?"` | Mensagem do diálogo, em texto simples (HTML não é interpretado).                        |
| `confirmText`  | `string`                                                                                     | `"Sair sem salvar"`                                                        | Texto do botão que continua a navegação.                                                |
| `cancelText`   | `string`                                                                                     | `"Continuar editando"`                                                     | Texto do botão que cancela a navegação.                                                 |
| `color`        | `"primary"` \| `"secondary"` \| `"positive"` \| `"informative"` \| `"caution"` \| `"danger"` | `"danger"`                                                                 | Cor do botão que continua a navegação.                                                  |
| `beforeUnload` | `boolean`                                                                                    | `true`                                                                     | Apresenta o aviso do navegador ao recarregar, fechar a aba ou sair por um link externo. |

### Acessibilidade

O diálogo usa o papel `alertdialog`. O foco inicia no botão "Continuar editando", fica restrito ao diálogo enquanto ele estiver aberto e volta ao elemento de origem quando ele fecha.

## Exemplo

```vue
<template>
  <u-text-field v-model="form.name" label="Nome" />
  <u-button :disabled="!hasChanges" @click="save">Salvar</u-button>
</template>
<script lang="ts" setup>
import { ref, toRaw } from "vue";
import { UButton, UTextField } from "@nexdom/uimed-vue/components";
import { useUnsavedChanges } from "@nexdom/uimed-vue/composables";

const saved = ref({ name: "Maria" });
const form = ref(structuredClone(toRaw(saved.value)));

const { hasChanges } = useUnsavedChanges({ previous: saved, current: form });

async function save() {
  await api.save(form.value);
  // Marca o formulário como salvo
  saved.value = structuredClone(toRaw(form.value));
}
</script>
```
