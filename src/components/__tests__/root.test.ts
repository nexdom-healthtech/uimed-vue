import Root from "@/components/root.vue";
import { mount } from "@vue/test-utils";

describe("root", () => {
  it("should exists", () => {
    const wrapper = mount(Root);
    expect(wrapper.exists()).toBe(true);
  });
});
