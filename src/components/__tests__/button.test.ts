import { VBtn } from "vuetify/components";
import { mount } from "@vue/test-utils";
import Button from "@/components/button.vue";

import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({ components, directives });

describe("button", () => {
  // it("should be defined", () => {
  //   expect(vuetify).not.toBeUndefined();
  //   expect(Object.keys(vuetify).length).toBeGreaterThan(0);
  // });
  const wrapper = mount(Button, {
    attrs: {
      "data-testid": "button",
    },
    global: {
      plugins: [vuetify],
    },
  });

  it("should exists", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should contain primary component", () => {
    expect(wrapper.findComponent(VBtn).exists()).toBe(true);
  });

  it('should not inherit "data-testid" attribute', () => {
    expect(wrapper.attributes("data-testid")).toBeUndefined();
  });
});
