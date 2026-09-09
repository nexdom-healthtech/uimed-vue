---
outline: deep
---

# O que é uimed-vue?

É um framework de UI, para [Vuejs](https://vuejs.org/), com diversos componentes e funções reutilizáveis entre eles (_components_ e _composables_).

> [!Danger]
> Construído para atender um design system específico e, portanto, eliminando a necessidade de qualquer esforço para sua estilização.
>
> Portanto, evite o uso de CSS ou estilizações paralelas enquanto estiver trabalhando com este framework.

## Casos de uso

### Componentes

São recursos que permitem a elaboração e reutilização de interface gráfica.

Os componentes a seguir possuem exemplos práticos de utilização dentro desta documentação.

| Recurso                                      | Descrição                              |
| -------------------------------------------- | -------------------------------------- |
| [Botões](./components/btn)                   | Componente de botão.                   |
| [Campos de texto](./components/text-field)   | Componente para campo de texto.        |
| [Componente base](./components/root)         | Componente raiz.                       |
| [Componentes de layout](./components/layout) | Componentes para seguir o grid system. |
| [Formulários](./components/frm)              | Componente de formulário.              |

### Composables

São funções que possibilitam a reutilização de recursos entre diversos componentes.

As composables a seguir possuem exemplos práticos de utilização dentro desta documentação.

| Recurso                           | Descrição                                      |
| --------------------------------- | ---------------------------------------------- |
| [Toasts](./composables/use-toast) | Composables para apresentar mensagens `toast`. |
