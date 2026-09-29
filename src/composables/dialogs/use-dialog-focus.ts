import { onMounted, watch } from "vue";

interface DialogFocus {
  isOpen: () => boolean;

  /** Element focused before the dialog opened, which gets the focus back when it closes. */
  origin: Element | null;
}

/** Focus state of the closed dialogs, by their card, for the dialogs opened from them. */
const closedDialogs = new WeakMap<Element, DialogFocus>();

/** Elements that can get the focus when the dialog opens. The first one in the dialog gets it. */
const focusable = [
  "button:not([disabled])",
  "[href]",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

/**
 * Moves the focus into a dialog once it opens and back to where it was when it closes, including
 * when dialogs are opened from others. Internal to the dialog components.
 * @param isActive - Whether the dialog is displayed. It turns `false` as soon as the dialog starts
 * leaving, so the focus returns right away.
 * @param card - The dialog's card, marked with `data-u-dialog`, or nothing while it isn't rendered.
 * @returns `focusFirstElement`, to call once the dialog finishes entering.
 */
export function useDialogFocus(
  isActive: () => boolean,
  card: () => Element | null | undefined,
): { focusFirstElement: () => void } {
  /** Focus state of this dialog, shared with the dialogs opened from it. */
  const focusState: DialogFocus = { isOpen: isActive, origin: null };

  // On mount instead of an immediate watcher, since the DOM doesn't exist during server-side rendering
  onMounted(() => onActiveChange(isActive()));
  watch(isActive, onActiveChange);

  function onActiveChange(active: boolean) {
    if (active) {
      focusState.origin = document.activeElement;
      return;
    }

    // Registered once closed, while its card exists, for the dialogs opened from it
    const element = card();
    if (element) closedDialogs.set(element, focusState);

    const target = findFocusTarget(focusState.origin);
    // Icons are usually SVG elements, which are focusable too
    if (hasFocus(element) && (target instanceof HTMLElement || target instanceof SVGElement)) {
      target.focus();
    }
  }

  function focusFirstElement() {
    card()?.querySelector<HTMLElement>(focusable)?.focus();
  }

  return { focusFirstElement };
}

/**
 * Element that gets the focus back when a dialog closes: its origin or, when the origin is inside
 * another dialog that closed meanwhile (and can't get the focus anymore), that dialog's.
 */
function findFocusTarget(origin: Element | null): Element | null {
  const card = origin?.closest("[data-u-dialog]");
  const owner = card && closedDialogs.get(card);
  return owner && !owner.isOpen() ? findFocusTarget(owner.origin) : origin;
}

/**
 * Whether the focus is on the dialog or lost (on nothing or on the page's body), so it can move.
 * Otherwise it moved elsewhere, e.g. to another dialog opened over this one.
 */
function hasFocus(card: Element | null | undefined) {
  const active = document.activeElement;
  if (!active) return true;

  // Besides the card's elements, its ancestors may have the focus: the card's container, when
  // the dialog has no focusable element or when its text is clicked, or the page's body
  return !!card && (card.contains(active) || active.contains(card));
}
