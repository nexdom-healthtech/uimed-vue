# Testes Unitários

Testes unitários com o UIMed-Vue são muito simples, pois este framework já vem com plugins que atendem as ferramentas que serão listadas a seguir.

## Usando Vitest

Para realizar as configurações, atualize seu arquivo `vite.config.ts` da seguinte maneira:

```ts [vite.config.ts]
import { defineConfig } from "vite";
import { vitestServerPluginUimed } from "@nexdom/uimed-vue/plugins"; // [!code ++]

export default defineConfig({
  test: {
    server: vitestServerPluginUimed(), // [!code ++]
  },
});
```

## Escrevendo os testes

Uma vez que as etapas mencionadas anteriormente foram realizadas, utilize o recurso de testes unitários do uimed-vue para montar os seus componentes `wrapper` através do [`@vue/test-utils`](https://test-utils.vuejs.org/).

```ts [hello-world.test.ts]
import { mount } from "@vue/test-utils";
import { vueTestUtilsPluginUimed } from "@nexdom/uimed-vue/unit-test"; // [!code ++]
import HelloWorld from "../hello-world.vue";

describe("HelloWorld", () => {
  it("displays message", () => {
    const wrapper = mount(HelloWorld, {
      global: {
        plugins: [vueTestUtilsPluginUimed()], // [!code ++]
      },
    });

    // Verifica se o wrapper/componente contém o texto esperado.
    expect(wrapper.text()).toContain("Olá, Mundo!");
  });
});
```

## Testando código que usa diálogos

Os diálogos das composables [`useDialog`](./composables/use-dialog) e [`useConfirm`](./composables/use-confirm) são exibidos pelo [Componente base](./components/main). Em um teste que monta apenas o seu componente, sem o `UMain`, nenhum diálogo é exibido e a `Promise` de `dialog` ou `confirm` não é resolvida.

Nos testes unitários, substitua as composables por versões simuladas que respondem pelo usuário:

```ts [delete-patient.test.ts]
import { mount } from "@vue/test-utils";
import { computed } from "vue";
import { vueTestUtilsPluginUimed } from "@nexdom/uimed-vue/unit-test";
import DeletePatient from "../delete-patient.vue";

vi.mock(import("@nexdom/uimed-vue/composables"), async (importOriginal) => ({
  ...(await importOriginal()),
  // Simula o usuário confirmando: executa a ação como o `confirm` faria
  useConfirm: () => ({
    confirm: vi.fn((_options, action, ...params) => action(...params)),
    isRunning: computed(() => false),
  }),
  // Simula o usuário escolhendo a ação de valor "stay"
  useDialog: () => ({ dialog: vi.fn().mockResolvedValue("stay") }),
}));

describe("DeletePatient", () => {
  it("deletes the patient once confirmed", async () => {
    const wrapper = mount(DeletePatient, {
      global: {
        plugins: [vueTestUtilsPluginUimed()],
      },
    });

    await wrapper.find("button").trigger("click");

    // Verifique aqui o efeito da ação confirmada.
  });
});
```

Para simular um cancelamento, faça o `confirm` simulado resolver `false` sem executar a ação, e o `dialog` simulado resolver `undefined`.

Para verificar o diálogo em si, prefira testes E2E, que exercitam a aplicação completa, com o `UMain` montado.
