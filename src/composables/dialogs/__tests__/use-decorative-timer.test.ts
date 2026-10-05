import useDecorativeTimer from "@/composables/dialogs/use-decorative-timer.ts";

describe("useDecorativeTimer", () => {
  describe.each(["onVnodeMounted", "onVnodeUpdated"] as const)("%s", (hook) => {
    // Called inside each test (not while collecting them), so mutation tests can cover it
    const hideTimer = (content: { el: Element }) => useDecorativeTimer()[hook](content);

    it("should hide the timer bar from assistive technologies", () => {
      const el = createContent(`
        <div class="v-snackbar__timer"><div role="progressbar" aria-hidden="false"></div></div>
        <div role="status" aria-live="polite">Message</div>
      `);

      hideTimer({ el });

      expect(el.querySelector("[role='progressbar']")?.getAttribute("aria-hidden")).toBe("true");
      expect(el.querySelector("[role='status']")?.hasAttribute("aria-hidden")).toBeFalsy();
    });

    it("should ignore progress bars outside the timer", () => {
      const el = createContent(`<div role="progressbar" aria-hidden="false"></div>`);

      hideTimer({ el });

      expect(el.querySelector("[role='progressbar']")?.getAttribute("aria-hidden")).toBe("false");
    });

    it("should ignore content without timer bar", () => {
      const el = createContent(`<div role="status" aria-live="polite">Message</div>`);

      expect(() => hideTimer({ el })).not.toThrow();
      expect(el.innerHTML).toBe(`<div role="status" aria-live="polite">Message</div>`);
    });
  });
});

function createContent(html: string) {
  const el = document.createElement("div");
  el.innerHTML = html.trim();
  return el;
}
