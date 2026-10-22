// @vitest-environment node
// The references are written with Node's file system, while the library builds

import { toSkillReference, writeSkillReferences } from "@/skills.ts";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));

function readRepoFile(path: string) {
  return readFileSync(join(root, path), "utf8");
}

describe("skills", () => {
  describe("usage skill", () => {
    const skill = readRepoFile("skills/uimed-vue/SKILL.md");
    const packageJson = JSON.parse(readRepoFile("package.json")) as {
      files: Array<string>;
      exports: Record<string, unknown>;
    };

    it("should be named after its folder and describe when to use it, as Agent Skills require", () => {
      const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(skill)?.[1] ?? "";
      const name = /^name: (.+)$/m.exec(frontmatter)?.[1];
      const description = /^description: (.+)$/m.exec(frontmatter)?.[1] ?? "";

      expect(name).toBe("uimed-vue");
      expect(description.length).toBeGreaterThan(0);
      expect(description.length).toBeLessThanOrEqual(1024);
    });

    it("should be published with the package, instead of the repo's agent instructions", () => {
      expect(packageJson.files).toContain("skills");
      expect(packageJson.files).not.toContain("AGENTS.md");
      expect(packageJson.files).not.toContain("CLAUDE.md");
    });

    it("should only mention entry points the package exports", () => {
      const entryPoints = new Set(skill.match(/@nexdom\/uimed-vue(?:\/[\w-]+)?(?=["`\s])/g));

      expect(entryPoints.size).toBeGreaterThan(1);
      for (const entryPoint of entryPoints) {
        const path = entryPoint.replace("@nexdom/uimed-vue", ".");
        expect(packageJson.exports, entryPoint).toHaveProperty([path]);
      }
    });

    it("should only mention components and composables the package exports", () => {
      const exported = [
        readRepoFile("src/components/index.ts"),
        readRepoFile("src/composables/index.ts"),
      ].join("\n");
      const names = new Set(skill.match(/\b(?:U[A-Z]\w+|use[A-Z]\w+)\b/g));

      expect(names).toContain("UMain");
      for (const name of names) {
        expect(exported, name).toMatch(new RegExp(`\\b${name}\\b`));
      }
    });

    it.each([
      ["createUimed", "src/index.ts"],
      ["vitePluginUimed", "src/plugins.ts"],
      ["vitestServerPluginUimed", "src/plugins.ts"],
      ["vueTestUtilsPluginUimed", "src/unit-test.ts"],
    ])("should mention `%s`, which %s exports", (name, path) => {
      expect(skill).toContain(name);
      expect(readRepoFile(path)).toMatch(new RegExp(`export function ${name}\\b`));
    });

    it("should only link to references generated from existing docs pages", () => {
      const links = [...skill.matchAll(/\]\(references\/([^)]+)\)/g)].map(([, path]) => path!);

      expect(links.length).toBeGreaterThan(0);
      for (const link of links) {
        expect(existsSync(join(root, "docs", link)), link).toBe(true);
      }
    });
  });

  describe("toSkillReference", () => {
    it("should keep the page's text and end it with a single line break", () => {
      expect(toSkillReference("# Title\n\nSome text.\n\n\n")).toBe("# Title\n\nSome text.\n");
    });

    it("should read pages with Windows line breaks", () => {
      expect(toSkillReference("# Title\r\n\r\nSome text.\r\n")).toBe("# Title\n\nSome text.\n");
    });

    it("should leave out the frontmatter", () => {
      expect(toSkillReference("---\noutline: deep\n---\n# Title\n")).toBe("# Title\n");
    });

    it("should keep a thematic break that isn't at the start of the page", () => {
      expect(toSkillReference("# Title\n---\nText\n---\n")).toBe("# Title\n---\nText\n---\n");
    });

    it("should leave out the live demos, with their markup over several lines", () => {
      const page = [
        "Before",
        "",
        "<demo>",
        '<u-section title="Demo">',
        "  Content",
        "</u-section>",
        "</demo>",
        "",
        "After",
      ].join("\n");

      expect(toSkillReference(page)).toBe("Before\n\nAfter\n");
    });

    it("should leave out a closing tag without its opening one, but not the content after it", () => {
      expect(toSkillReference("Before\n</div>\nAfter")).toBe("Before\nAfter\n");
    });

    it("should not start another tag at a `<` inside an opening tag", () => {
      expect(toSkillReference("Before\n<u-chip\n  :value=a<b\n/>\nAfter")).toBe("Before\nAfter\n");
    });

    it("should leave out an indented demo", () => {
      expect(toSkillReference("Before\n  <demo>\n  Inside\n  </demo>\nAfter")).toBe(
        "Before\nAfter\n",
      );
    });

    it("should leave out a demo written in a single line", () => {
      expect(toSkillReference("Before\n<demo><u-button>Ok</u-button></demo>\nAfter")).toBe(
        "Before\nAfter\n",
      );
    });

    it("should leave out a playground with self-closing elements and arrows inside attributes", () => {
      const page = [
        "<playground",
        "  :props=\"{ label: '>' }\"",
        "  title='Exemplo'",
        ">",
        '  <u-text-field label="Nome" />',
        '  <u-button @click="() => submit()">Enviar</u-button>',
        "</playground>",
        "After",
      ].join("\n");

      expect(toSkillReference(page)).toBe("After\n");
    });

    it("should leave out nested elements until the outer one closes", () => {
      const page = [
        "<ClientOnly>",
        "<div>",
        "<p>Inner</p>",
        "</div>",
        "Still inside",
        "</ClientOnly>",
        "After",
      ].join("\n");

      expect(toSkillReference(page)).toBe("After\n");
    });

    it("should leave out the page's scripts and styles", () => {
      const page = [
        "Text",
        '<script lang="ts" setup>',
        'import { UMain } from "../../../dist/components.js";',
        "const items = [1, 2].filter((item) => item > 1);",
        "</script>",
        "<style>",
        ".demo > * { margin: 0; }",
        "</style>",
      ].join("\n");

      expect(toSkillReference(page)).toBe("Text\n");
    });

    it.each([
      ["a void element", "<hr>"],
      ["a void element in uppercase", "<HR>"],
      ["a void element with attributes", '<img src="logo.svg" alt="">'],
      ["a self-closing element", "<u-divider />"],
      ["a self-closing element with `>` in an attribute", '<u-button @click="() => go()" />'],
      ["a self-closing element with `>` in single quotes", "<u-button label='a > b' />"],
      [
        "a self-closing element with the other quote in an attribute",
        `<u-chip :label="'a > b'" />`,
      ],
    ])("should leave out %s without the content after it", (_, element) => {
      expect(toSkillReference(`Before\n${element}\nAfter`)).toBe("Before\nAfter\n");
    });

    it("should leave out the HTML comments outside the code examples", () => {
      // The markup after the quote is still part of the comment
      const page = ["<!-- A comment", "that's over <demo> two lines -->", "After"].join("\n");

      expect(toSkillReference(page)).toBe("After\n");
    });

    it("should leave out an element after a comment in the same line", () => {
      expect(toSkillReference("<!-- note --> <demo>\nInside\n</demo>\nAfter")).toBe("After\n");
    });

    it("should leave out the markers of custom containers and keep their content", () => {
      const page = [
        "::: code-group",
        "```sh [npm]",
        "npm i",
        "```",
        ":::",
        "::: tip Dica",
        "Text",
        ":::",
      ];

      expect(toSkillReference(page.join("\n"))).toBe("```sh [npm]\nnpm i\n```\nText\n");
    });

    it("should keep the code examples as they are, including their markup, comments and links", () => {
      const example = [
        "```vue",
        "<!-- App.vue -->",
        "<template>",
        "  <u-main />",
        "</template>",
        "",
        "",
        "",
        ":::",
        "[docs](./section)",
        "```",
      ].join("\n");

      expect(toSkillReference(`${example}\nAfter`)).toBe(
        `${example.replace("\n\n\n\n", "\n\n")}\nAfter\n`,
      );
    });

    it("should keep the inline markup inside a paragraph", () => {
      expect(toSkillReference("Press <kbd>Ctrl</kbd> + <kbd>K</kbd>.")).toBe(
        "Press <kbd>Ctrl</kbd> + <kbd>K</kbd>.\n",
      );
    });

    it.each([
      ["a sibling page", "[Seção](./section)", "[Seção](./section.md)"],
      ["a page with an anchor", "[Ações](./section#acoes)", "[Ações](./section.md#acoes)"],
      [
        "a page in another folder",
        "[API](../../api/components/button)",
        "[API](../../api/components/button.md)",
      ],
      ["a folder's index", "[API](../api/)", "[API](../api/index.md)"],
      ["a folder's index with an anchor", "[API](../api/#grupos)", "[API](../api/index.md#grupos)"],
      ["a page with a dot in its anchor", "[Notas](./notes#v2.0)", "[Notas](./notes.md#v2.0)"],
      ["several links in a line", "[A](./a) e [B](../b)", "[A](./a.md) e [B](../b.md)"],
    ])("should point the link to %s to its reference file", (_, link, reference) => {
      expect(toSkillReference(link)).toBe(`${reference}\n`);
    });

    it.each([
      ["an external page", "[Vue](https://vuejs.org/guide)"],
      ["an anchor in the same page", "[Seção](#componente-section)"],
      ["a page that already has its extension", "[Seção](./section.md)"],
      ["a file with another extension", "[Logo](./logo.svg)"],
      ["a path without a relative start", "[Seção](section)"],
    ])("should keep the link to %s as it is", (_, link) => {
      expect(toSkillReference(link)).toBe(`${link}\n`);
    });
  });

  describe("writeSkillReferences", () => {
    let root: string;

    beforeEach(async () => {
      root = await mkdtemp(join(tmpdir(), "uimed-skills-"));
    });

    afterEach(async () => {
      await rm(root, { recursive: true, force: true });
    });

    async function write(path: string, content: string) {
      await mkdir(dirname(join(root, path)), { recursive: true });
      await writeFile(join(root, path), content);
    }

    it("should write a reference for each page of the guide and the API, with the same paths", async () => {
      await write("docs/guide/getting-started.md", "---\noutline: deep\n---\n# Iniciando\n");
      await write("docs/guide/components/section.md", "# Section\n<demo>\n</demo>\n");
      await write("docs/api/components/section.md", "[Guia](../../guide/components/section)");

      await writeSkillReferences(join(root, "docs"), join(root, "references"));

      const references = join(root, "references");
      expect((await readdir(references, { recursive: true })).sort()).toEqual(
        [
          "api",
          join("api", "components"),
          join("api", "components", "section.md"),
          "guide",
          join("guide", "components"),
          join("guide", "components", "section.md"),
          join("guide", "getting-started.md"),
        ].sort(),
      );
      expect(await readFile(join(references, "guide", "getting-started.md"), "utf8")).toBe(
        "# Iniciando\n",
      );
      expect(await readFile(join(references, "guide", "components", "section.md"), "utf8")).toBe(
        "# Section\n",
      );
      expect(await readFile(join(references, "api", "components", "section.md"), "utf8")).toBe(
        "[Guia](../../guide/components/section.md)\n",
      );
    });

    it("should leave out the other docs folders and the files that aren't pages", async () => {
      await write("docs/guide/index.md", "# Guia\n");
      await write("docs/guide/logo.svg", "<svg />");
      await write("docs/api/index.md", "# API\n");
      await write("docs/index.md", "# Home\n");
      await write("docs/.vitepress/theme/index.md", "# Theme\n");

      await writeSkillReferences(join(root, "docs"), join(root, "references"));

      expect((await readdir(join(root, "references"), { recursive: true })).sort()).toEqual(
        ["api", join("api", "index.md"), "guide", join("guide", "index.md")].sort(),
      );
    });

    it("should replace the references of a previous build", async () => {
      await write("docs/guide/index.md", "# Guia\n");
      await write("docs/api/index.md", "# API\n");
      await write("references/guide/removed-page.md", "# Removed\n");

      await writeSkillReferences(join(root, "docs"), join(root, "references"));

      expect((await readdir(join(root, "references", "guide"))).sort()).toEqual(["index.md"]);
    });
  });
});
