beforeAll(() => {
  // Workaround for issue https://github.com/vuetifyjs/vuetify/issues/21692, which is fixed but have no docs yet.
  vi.stubGlobal("visualViewport", new EventTarget());

  vi.useFakeTimers();
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "log").mockImplementation(() => {});
});
