import { defineConfig } from "vitepress";

const pkg = require("../../package.json");
const releaseYear = 2026;
const currentYear = new Date().getFullYear();
const currentYearText = currentYear > releaseYear ? `-${currentYear}` : "";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "pt-BR",
  title: "pkg-template | NEXDOM",
  base: "/pkg-template/",
  head: [["link", { rel: "icon", href: "/pkg-template/favicon.svg" }]],
  description: "Um template para a criação validando de libs NEXDOM.",
  lastUpdated: true,
  cleanUrls: true,
  sitemap: {
    hostname: "https://nexdom-healthtech.github.io/pkg-template/",
  },
  markdown: {
    container: {
      infoLabel: "INFORMAÇÃO",
      noteLabel: "INFORMAÇÃO",
      tipLabel: "DICA",
      warningLabel: "AVISO",
      dangerLabel: "ATENÇÃO",
      detailsLabel: "DETALHES",
      importantLabel: "IMPORTANTE",
      cautionLabel: "ATENÇÃO",
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/favicon.svg",
    siteTitle: "pkg-template",
    darkModeSwitchLabel: "Tema Escuro",
    darkModeSwitchTitle: "Mudar para Modo Escuro",
    lightModeSwitchTitle: "Mudar para Modo Claro",
    returnToTopLabel: "Retornar ao topo",
    outline: { label: "Nesta página" },
    docFooter: { prev: "Anterior", next: "Próximo" },
    search: {
      provider: "local",
      options: {
        translations: {
          button: { buttonText: "Buscar" },
          modal: {
            noResultsText: "Nenhum resultado encontrado para",
            resetButtonTitle: "Limpar",
            displayDetails: "Exibir detalhes",
            footer: { navigateText: "Navegar", selectText: "Selecionar", closeText: "Fechar" },
          },
        },
      },
    },
    lastUpdated: { text: "Atualizado em" },
    editLink: {
      text: "Edite esta página no GitHub",
      pattern: "https://github.com/nexdom-healthtech/pkg-template/edit/main/docs/:path",
    },
    notFound: {
      title: "PÁGINA NÃO ENCONTRADA",
      linkText: "Me leve para casa",
      quote: "Mas se você não mudar de direção e continuar procurando, pode acabar onde está indo.",
    },
    nav: [
      { text: "Guia", link: "/guide/", activeMatch: "/guide/" },
      { text: "API", link: "/api/", activeMatch: "/api/" },
      {
        text: `v${pkg.version}`,
        items: [
          {
            text: "Releases",
            link: "https://github.com/nexdom-healthtech/pkg-template/releases",
          },
          {
            text: "Contribuindo",
            link: "https://github.com/nexdom-healthtech/pkg-template/blob/main/CONTRIBUTING.md",
          },
        ],
      },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "Introdução",
          items: [
            { text: "O que é pkg-template?", link: "/guide/" },
            { text: "Iniciando", link: "/guide/getting-started" },
          ],
        },
      ],
      "/api/": [
        {
          text: "Utils",
          collapsed: false,
          items: [
            {
              text: "sayHello",
              link: "/api/say-hello",
            },
          ],
        },
      ],
    },
    socialLinks: [{ icon: "github", link: "https://github.com/nexdom-healthtech/pkg-template" }],
    footer: {
      message: "Lançado sob licença MIT",
      copyright: `Direitos reservados © ${releaseYear}${currentYearText} NEXDOM HealthTech`,
    },
  },
});
