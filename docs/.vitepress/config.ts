import { defineConfig } from "vitepress";
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons";

const pkg = require("../../package.json");
const releaseYear = 2026;
const currentYear = new Date().getFullYear();
const currentYearText = currentYear > releaseYear ? `-${currentYear}` : "";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "pt-BR",
  title: "uimed-vue | NEXDOM",
  base: "/uimed-vue/",
  head: [["link", { rel: "icon", href: "/uimed-vue/favicon.svg" }]],
  description: "Um template para a criação validando de libs NEXDOM.",
  lastUpdated: true,
  cleanUrls: true,
  sitemap: {
    hostname: "https://nexdom-healthtech.github.io/uimed-vue/",
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
    config(md) {
      md.use(groupIconMdPlugin);
    },
  },
  vite: {
    plugins: [groupIconVitePlugin()],
    ssr: {
      noExternal: [/\.css$/, /^vuetify/],
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/favicon.svg",
    siteTitle: "uimed-vue",
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
      pattern: "https://github.com/nexdom-healthtech/uimed-vue/edit/main/docs/:path",
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
            link: "https://github.com/nexdom-healthtech/uimed-vue/releases",
          },
          {
            text: "Contribuindo",
            link: "https://github.com/nexdom-healthtech/uimed-vue/blob/main/CONTRIBUTING.md",
          },
        ],
      },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "Introdução",
          items: [
            { text: "O que é uimed-vue?", link: "/guide/" },
            { text: "Iniciando", link: "/guide/getting-started" },
          ],
        },
        {
          text: "Componentes",
          items: [
            { text: "Root", link: "/guide/components/root" },
            { text: "Button", link: "/guide/components/button" },
          ],
        },
      ],
      "/api/": [
        {
          text: "Componentes",
          collapsed: false,
          items: [
            {
              text: "Root",
              link: "/api/components/root",
            },
            {
              text: "Button",
              link: "/api/components/button",
            },
          ],
        },
      ],
    },
    socialLinks: [{ icon: "github", link: "https://github.com/nexdom-healthtech/uimed-vue" }],
    footer: {
      message: "Lançado sob licença MIT",
      copyright: `Direitos reservados © ${releaseYear}${currentYearText} NEXDOM HealthTech`,
    },
  },
});
