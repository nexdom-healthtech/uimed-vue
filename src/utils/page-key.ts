import type { VNode } from "vue";

/**
 * Id of each type of node rendered as a page (components, elements, fragments...), in the order
 * they're first seen. Page components are few and live as long as the app, so they're kept. The
 * ids don't need to match between server and client rendering, since the key isn't rendered to
 * the HTML.
 */
const typeIds = new Map<VNode["type"], number>();

function getTypeId(type: VNode["type"]): number | undefined {
  if (!typeIds.has(type)) {
    typeIds.set(type, typeIds.size);
  }
  return typeIds.get(type);
}

/**
 * Key of the page made of the given nodes (the ones rendered by `UPageTransition`'s default slot),
 * from the type and the `key` of each of them. It changes when another component is rendered (or
 * the same one with another `key`, e.g. `route.fullPath`), and stays the same while the same page
 * is rendered.
 *
 * `UPageTransition` gives it to the element that wraps the page, so the transition animates that
 * element, whatever the page renders at its root (fragments, several elements, comments).
 */
export function getPageKey(nodes: VNode[] = []): string {
  return nodes.map((node) => `${getTypeId(node.type)}:${String(node.key)}`).join();
}
