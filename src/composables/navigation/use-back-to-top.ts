import { onMounted, ref, toValue, type MaybeRefOrGetter, type Ref } from "vue";

export interface BackToTop {
  /** Whether the top of the content is more than one screen above the viewport. */
  visible: Ref<boolean>;
  /** Updates `visible` from the current scroll, e.g. on each scroll of the page. */
  onScroll: () => void;
  /**
   * Scrolls to the top of the content, smoothly unless the user prefers reduced motion, and moves
   * the focus to it, so keyboard users don't keep the focus at the end of the page.
   */
  backToTop: () => void;
}

/**
 * Back-to-top button's state for `content`, the template ref of the component whose element the
 * button brings into view and focuses (which must be focusable, e.g. with `tabindex="-1"`). The
 * button shows once the top of the content is a screen above the viewport, instead of after the page
 * scrolls a screen: in apps both are the same, but on pages with more than one `UMain` (like the
 * docs) only the one scrolled past shows it.
 */
export default function useBackToTop(
  content: MaybeRefOrGetter<{ $el: HTMLElement } | null>,
): BackToTop {
  const visible = ref(false);

  function onScroll() {
    const element = toValue(content)?.$el;
    visible.value = element ? -element.getBoundingClientRect().top > globalThis.innerHeight : false;
  }

  function backToTop() {
    const element = toValue(content)?.$el;
    if (!element) return;

    globalThis.scrollTo({
      top: globalThis.scrollY + element.getBoundingClientRect().top,
      behavior: prefersReducedMotion() ? "instant" : "smooth",
    });
    // The scroll already brings the content into view, and smoothly
    element.focus({ preventScroll: true });
  }

  // A page can load already scrolled, e.g. when the browser restores its position
  onMounted(onScroll);

  return { visible, onScroll, backToTop };
}

function prefersReducedMotion() {
  return globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
