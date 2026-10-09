/**
 * Content props that hide a snackbar's timer bar from assistive technologies,
 * keeping it only as a visual countdown, since the message itself is already
 * announced by the snackbar's live region.
 *
 * Workaround until Vuetify offers an option for it: the timer bar is a
 * `VProgressLinear` that always renders `role="progressbar"` with
 * `aria-hidden="false"` and no accessible name, and neither `VSnackbar` nor
 * Vuetify's defaults can set attributes on it. So these vnode hooks mark the
 * bar after every render of the snackbar content, which also covers the bar
 * recreated when the pointer leaves the snackbar. Vue doesn't patch the
 * attribute back, since Vuetify keeps rendering the same `"false"` value.
 */
export default function useDecorativeTimer() {
  return { onVnodeMounted: hideTimer, onVnodeUpdated: hideTimer };
}

function hideTimer({ el }: { el: Element }) {
  el.querySelector(".v-snackbar__timer [role='progressbar']")?.setAttribute("aria-hidden", "true");
}
