# UButton

Componente para utilização de botões.

## Props

| Prop         | Tipo                                                                               | Padrão      | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------ | ---------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`    | `"primary" \| "secondary" \| "ghost"`                                              | `"primary"` | Aplica uma variação de estilo distinta ao botão.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `color`      | `"primary" \| "secondary" \| "positive" \| "informative" \| "caution" \| "danger"` | `"primary"` | Aplica uma cor ao botão.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `disabled`   | `boolean`                                                                          | `false`     | Remove a possibilidade de clicar ou focar no botão.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `loading`    | `boolean`                                                                          | `false`     | Exibe um indicador de carregamento e desabilita o botão enquanto ativa, assim como `disabled`: não é possível clicar ou focar no botão, o evento `click` não é disparado e o seu formulário não é enviado, inclusive ao pressionar `Enter` em um dos campos do formulário, quando o botão é o primeiro botão de envio do formulário. Nesse estado, o botão tem a aparência de desabilitado, com o indicador de carregamento, e, se estiver focado, perde o foco ao entrar em carregamento, como qualquer botão desabilitado. O botão mantém o texto como nome acessível e fica marcado como ocupado, e leitores de tela ignoram o indicador. |
| `fullWidth`  | `boolean`                                                                          | `false`     | Faz o botão ocupar 100% da largura do elemento em que está.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `type`       | `"button" \| "submit"`                                                             | `button`    | Aplica atributo [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#type) para modificar o comportamento do componente.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `form`       | `string`                                                                           |             | Aplica atributo [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#form), com o `id` do formulário com que o botão está relacionado.                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `dataTestid` | `string`                                                                           |             | Aplica atributo `data-testid` para testes sobre o componente.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

## Eventos

| Evento  | Retorno                                                                     | Descrição                                                                                          |
| ------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `click` | [`MouseEvent`](https://developer.mozilla.org/pt-BR/docs/Web/API/MouseEvent) | Disparado quando o botão é clicado. Não é disparado enquanto o botão está `disabled` ou `loading`. |

## Slots

| Slot      | Descrição                         |
| --------- | --------------------------------- |
| `default` | Conteúdo exibido dentro do botão. |

## Exemplo

```vue
<template>
  <u-button variant="ghost" color="danger" :loading="loading" @click="onClick">Excluir</u-button>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UButton } from "@nexdom/uimed-vue/components";

const loading = ref(false);

function onClick(event: MouseEvent) {
  console.log("Botão clicado!", event);
}
</script>
```
