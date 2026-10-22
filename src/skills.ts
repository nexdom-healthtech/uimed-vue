import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

/** Docs folders that become the references of the usage skill, with the same paths */
const referenceFolders = ["guide", "api"];

/** HTML elements without a closing tag */
const voidElements = new Set(["area", "br", "col", "embed", "hr", "img", "input", "link", "meta"]);

/**
 * Matches the parts of a line that change the position inside an HTML block: the start and end of
 * a comment, the start of an opening or closing tag (e.g. `<demo` or `</u-row`), quotes and `>`
 */
const htmlToken = /<!--|-->|<(\/?)([a-zA-Z][\w.-]*)|["'>]/g;

/** Matches the relative links between pages, e.g. `](./section#acoes)` or `](../../api/)` */
const relativeLink = /\]\((\.{1,2}\/[^)\s]*)\)/g;

/**
 * Position inside the HTML blocks of a page, which only render on the docs site (demos,
 * playgrounds, the page's scripts and wrappers like `<ClientOnly>`)
 */
interface HtmlState {
  /** Elements open around the current position */
  depth: number;
  /** The tag the position is inside, until its `>` */
  tag?: Tag;
  /** Whether the position is inside an HTML comment */
  comment: boolean;
}

/** An opening or closing tag, until its `>` */
interface Tag {
  name: string;
  closing: boolean;
  /** The quote of the attribute value the position is inside */
  quote?: string;
}

/**
 * Converts a docs page into a reference for the usage skill: keeps its text, tables and code
 * examples, and leaves out what only renders on the docs site, such as the frontmatter, the HTML
 * blocks (live demos, playgrounds and the page's scripts) and the markers of custom containers.
 * The relative links point to the other references' files.
 */
export function toSkillReference(page: string): string {
  const lines = page.split(/\r?\n/);
  const kept: Array<string> = [];
  let index = lines[0] === "---" ? lines.indexOf("---", 1) + 1 : 0;
  let fence = false;
  let html: HtmlState | undefined;

  for (; index < lines.length; index++) {
    const line = lines[index];
    const trimmed = line.trim();

    if (html || (!fence && trimmed.startsWith("<"))) {
      html = skipHtml(line, html ?? { depth: 0, comment: false });
      // A closing tag without its opening one doesn't leave the rest of the page out
      if (html.depth <= 0 && !html.tag && !html.comment) html = undefined;
    } else if (trimmed.startsWith("```")) {
      fence = !fence;
      kept.push(line);
    } else if (fence) {
      kept.push(line);
    } else if (!trimmed.startsWith(":::")) {
      kept.push(line.replaceAll(relativeLink, (_, link: string) => `](${toReferenceLink(link)})`));
    }
  }

  // The left out blocks would leave runs of blank lines behind
  return `${kept
    .join("\n")
    .replaceAll(/\n{3,}/g, "\n\n")
    .trim()}\n`;
}

/**
 * Points a relative link of the site, written without the `.md` extension, to its reference file:
 * the page's file, or the folder's index. Links to files keep their path.
 */
function toReferenceLink(link: string): string {
  const anchorStart = link.indexOf("#");
  const path = anchorStart === -1 ? link : link.slice(0, anchorStart);
  const anchor = anchorStart === -1 ? "" : link.slice(anchorStart);
  const page = path.slice(path.lastIndexOf("/") + 1);

  if (page.includes(".")) return link;

  return `${path}${page ? ".md" : "index.md"}${anchor}`;
}

/** Follows the tags of a line inside an HTML block, which is left out of the reference */
function skipHtml(line: string, state: HtmlState): HtmlState {
  let { depth, tag, comment } = state;

  for (const { 0: token, 1: slash, 2: name, index } of line.matchAll(htmlToken)) {
    if (comment) {
      comment = token !== "-->";
    } else if (tag) {
      const followed = followTag(tag, token, line[index - 1] === "/");
      tag = followed.tag;
      depth += followed.depth;
    } else if (token === "<!--") {
      comment = true;
    } else if (name) {
      tag = { name: name.toLowerCase(), closing: slash === "/" };
    }
  }

  return { depth, tag, comment };
}

/**
 * Follows a token inside a tag: returns the tag while it's still open, and the change in the
 * number of open elements when the token ends it
 *
 * @param afterSlash Whether the token comes right after a `/`, as the `>` of a self-closing tag.
 */
function followTag(tag: Tag, token: string, afterSlash: boolean): { tag?: Tag; depth: number } {
  // A `>` inside a quoted attribute, as in `@click="() => open()"`, doesn't end the tag
  if (tag.quote) return { tag: token === tag.quote ? { ...tag, quote: undefined } : tag, depth: 0 };
  if (token === '"' || token === "'") return { tag: { ...tag, quote: token }, depth: 0 };
  if (token !== ">") return { tag, depth: 0 };
  if (tag.closing) return { depth: -1 };

  return { depth: afterSlash || voidElements.has(tag.name) ? 0 : 1 };
}

/**
 * Writes the references of the usage skill from the docs pages, replacing the previous ones, so
 * the published skill describes the same version as the package.
 *
 * @param docs The docs folder, with the `guide` and `api` pages.
 * @param references The skill's `references` folder.
 */
export async function writeSkillReferences(docs: string, references: string): Promise<void> {
  await rm(references, { recursive: true, force: true });

  for (const folder of referenceFolders) {
    const pages = await readdir(join(docs, folder), { recursive: true });

    for (const page of pages.filter((path) => path.endsWith(".md"))) {
      const target = join(references, folder, page);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, toSkillReference(await readFile(join(docs, folder, page), "utf8")));
    }
  }
}
