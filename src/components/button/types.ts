import type { RouteLocationRaw } from "vue-router";
import type { ColorVariant } from "@/composables/colors/types.ts";

export type ButtonVariant = "primary" | "secondary" | "ghost";

/**
 * Props exposed by the {@link Button} component.
 */
export type ButtonProps = {
  /**
   * Applies a distinct style variation to the button.
   * One of `primary`, `secondary`, or `ghost`.
   * @default "primary"
   */
  variant?: ButtonVariant;

  /**
   * Applies a distinct behavior to the button.
   * One of `button` or `submit`. Ignored when `route` is set.
   * @default "button"
   */
  type?: "submit" | "button";

  /**
   * Applies a color to the button.
   * One of `primary`, `secondary`, `positive`, `informative`, `caution`, or `danger`.
   * @default "primary"
   */
  color?: ColorVariant;

  /**
   * Removes the ability to click or target the button.
   * @default false
   */
  disabled?: boolean;

  /**
   * Displays a loading indicator on the button and disables it while active, as `disabled` does:
   * it can't be clicked or focused, `click` isn't emitted and its form isn't submitted, including
   * by pressing `Enter` in one of the form's fields when it's the form's first submit button. It
   * looks disabled, with the indicator, and loses focus if focused when loading starts, as any
   * disabled button does. The button keeps its text as accessible name and is marked as busy, and
   * assistive technologies ignore the indicator.
   * @default false
   */
  loading?: boolean;

  /**
   * Stretches the button to the whole width of its parent, e.g. the only action of a form on a
   * small screen.
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Associated [form](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/form) id.
   * Ignored when `route` is set.
   */
  form?: string;

  /**
   * Where the button goes when clicked, rendering it as a link with the button's look. A route
   * inside the app (`"/patients"`, `{ name: "patient", params: { id } }`) navigates through the
   * app's router; a URL starting with `http` navigates through the browser, in the same tab. While
   * `disabled` or `loading`, the button doesn't navigate and is rendered as a disabled button.
   */
  route?: RouteLocationRaw;

  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;
};

/**
 * Events emitted by the {@link Button} component.
 */
export type ButtonEmits =
  /**
   * Emitted when the button is clicked. Not emitted while the button is `disabled` or `loading`.
   * @param {MouseEvent} event - The native `MouseEvent` object associated with the click.
   * @returns void
   */
  (e: "click", event: MouseEvent) => void;
