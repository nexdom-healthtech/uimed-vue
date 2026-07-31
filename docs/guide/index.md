---
outline: deep
---

# O que é pkg-template?

É um [GitHub template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository#about-template-repositories) para criar bibliotecas [TypeScript](https://www.typescriptlang.org/), utilizando o [Vite+](https://viteplus.dev/), e disponibilizá-las, preferencialmente, mas não exclusivamente, no [GitHub](https://github.com/) e [NPM](https://www.npmjs.com/).

A mesma também provisiona pipelines de CI/CD (validações de qualidade e versionamento automático baseado em [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/), pronto para publicação no [NPM](https://www.npmjs.com/)), [Dependabot](https://github.com/dependabot), e geração e publicação de documentações feitas com [VitePress](https://vitepress.dev/), no [GitHub Pages](https://docs.github.com/en/pages).

## Casos de uso

### Criação de Novos Repositórios

É possível utilizar este template como base para algum outro tipo de aplicação, visto que o mesmo já dispões de diversas configurações para assegurar a qualidade do projeto. Isso garante muito mais agilidade e assertividade no processo de abertura de novos repositórios.

### Demandas Comuns

Compartilhamento de códigos comuns, como formatações de data/hora, máscaras de campo, entre outros utilitários que não fazem parte da regra de negócio.

### Recursos de MFE

Alguns casos, como módulos compartilhados entre apps de uma arquitetura micro frontend, ou que estão como `shared` em uma arquitetura monolítica, poderiam ser transformados em bibliotecas centrais, para que sejam reaproveitados e evoluídos constantemente, em diversos projetos, através deste modelo de template.
