import { defineConfig } from "vitepress";
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons";
import { vitePluginUimed } from "../../dist/plugins.js";

const pkg = require("../../package.json");
const releaseYear = 2026;
const currentYear = new Date().getFullYear();
const currentYearText = currentYear > releaseYear ? `-${currentYear}` : "";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "pt-BR",
  title: "UIMed-Vue | NEXDOM",
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
    plugins: [vitePluginUimed(), groupIconVitePlugin()],
    ssr: {
      noExternal: [/\.css$/, /^vuetify/],
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/favicon.svg",
    siteTitle: "UIMed-Vue",
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
            { text: "O que é UIMed-Vue?", link: "/guide/" },
            { text: "Iniciando", link: "/guide/getting-started" },
            { text: "Testes Unitários", link: "/guide/unit-testing" },
            { text: "Migrando de v1 para v2", link: "/guide/migration-v1-to-v2" },
          ],
        },
        {
          text: "Componentes",
          collapsed: false,
          items: [
            {
              text: "Conteúdo",
              items: [
                { text: "Componente base", link: "/guide/components/main" },
                { text: "Componentes de layout", link: "/guide/components/layout" },
                { text: "Agrupador de Conteúdo", link: "/guide/components/section" },
              ],
            },
            {
              text: "Campos e formulários",
              items: [
                { text: "Campos de texto", link: "/guide/components/text-field" },
                { text: "Formulários", link: "/guide/components/form" },
              ],
            },
            {
              text: "Ações",
              items: [{ text: "Botões", link: "/guide/components/button" }],
            },
          ],
        },
        {
          text: "Composables",
          collapsed: false,
          items: [
            {
              text: "Diálogos",
              items: [
                { text: "Toasts", link: "/guide/composables/use-toast" },
                { text: "Run or toast", link: "/guide/composables/use-run-or-toast" },
              ],
            },
          ],
        },
      ],
      "/api/": [
        {
          text: "Componentes",
          collapsed: false,
          items: [
            { text: "Button", link: "/api/components/button" },
            {
              text: "Content Area",
              collapsed: false,
              items: [
                { text: "Section", link: "/api/components/section" },
                { text: "SectionContent", link: "/api/components/section-content" },
              ],
            },
            { text: "Form", link: "/api/components/form" },
            {
              text: "Grid",
              collapsed: false,
              items: [
                { text: "Container", link: "/api/components/grid/container" },
                { text: "Row", link: "/api/components/grid/row" },
                { text: "Column", link: "/api/components/grid/column" },
              ],
            },
            { text: "Main", link: "/api/components/main" },
            { text: "TextField", link: "/api/components/text-field" },
          ],
        },
        {
          text: "Composables",
          collapsed: false,
          items: [
            {
              text: "useToast",
              link: "/api/composables/use-toast",
            },
            {
              text: "useRunOrToast",
              link: "/api/composables/use-run-or-toast",
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
