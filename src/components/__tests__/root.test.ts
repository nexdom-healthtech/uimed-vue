import { VApp } from "vuetify/components";
import Root from "@/components/root.vue";
import { mount } from "@vue/test-utils";

import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({ components, directives });

describe("root", () => {
  const wrapper = mount(Root, {
    global: {
      plugins: [vuetify],
    },
  });

  it("should exists", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should contain primary component", () => {
    expect(wrapper.findComponent(VApp).exists()).toBe(true);
  });
});
