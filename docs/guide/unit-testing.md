# Testes Unitários

Testes unitários com o uimed-vue são muito simples, pois este framework já vem com plugins que atendem as ferramentas que serão listadas a seguir.

## Usando Vitest

Para realizar as configurações, atualize seu arquivo `vite.config.ts` da seguinte maneira:

```ts [vite.config.ts]
import { defineConfig } from "vite";
import { vitestServerPluginUimed } from "@nexdom/uimed-vue/plugins.ts"; // [!code ++]

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
import { vueTestUtilsPluginUimed } from "@nexdom/uimed-vue/unit-test.ts"; // [!code ++]
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
