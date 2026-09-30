import { VForm } from "vuetify/components";
import { h, type VNode } from "vue";
import Form from "@/components/form/form.vue";
import TextField from "@/components/inputs/text-field/text-field.vue";
import Button from "@/components/button/button.vue";
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import type { ComponentProps } from "vue-component-type-helpers";
import { vueTestUtilsPluginUimed } from "@/unit-test.ts";

const testId = "form-test-component";
const styleValue = "random-style";
const classValue = "random-class";

describe("Form", () => {
  const wrapper = mountForm();

  it("should exists", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should contain primary component", () => {
    expect(wrapper.findComponent(VForm).exists()).toBeTruthy();
  });

  it('should inherit "data-testid" attribute', () => {
    expect(wrapper.attributes("data-testid")).toBe(testId);
  });

  it("should not inherit unexpected attributes", () => {
    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("class")).not.toBeUndefined();
    expect(wrapper.attributes("class")).not.toBe(classValue);
  });

  describe("props", () => {
    describe("id", () => {
      it('should send the "id" prop to the primary component', async () => {
        const id = "random-id";
        const wrapper = mountForm();

        await wrapper.setProps({ id });

        expect(wrapper.findComponent(VForm).attributes("id")).toBe(id);
      });
    });
  });

  describe("events", () => {
    describe("submit", () => {
      it("should call the `onSubmit` handler when the form is submitted", async () => {
        const onSubmit = vi.fn();
        const wrapper = mountForm({}, { onSubmit });

        await wrapper.trigger("submit");

        expect(onSubmit).toHaveBeenCalledOnce();
        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ defaultPrevented: true }));
      });

      it("shouldn't call the `onSubmit` handler when the form contains invalid fields", async () => {
        const onSubmit = vi.fn();
        const wrapper = mountForm(
          { default: () => h(TextField, { required: true }) },
          { onSubmit },
        );

        await wrapper.trigger("submit");
        await flushPromises();

        const textField = wrapper.findComponent(TextField);
        expect(textField.exists()).toBeTruthy();
        expect(textField.props("required")).toBe(true);
        expect(onSubmit).not.toHaveBeenCalled();
      });

      describe("with loading buttons", () => {
        afterEach(() => {
          attachedWrappers.splice(0).forEach((wrapper) => wrapper.unmount());
          document.body.innerHTML = "";
        });

        it("shouldn't call the `onSubmit` handler while a submit button inside it is loading", async () => {
          const onSubmit = vi.fn();
          const wrapper = mountForm(
            { default: () => [h(TextField), h(Button, { type: "submit", loading: true })] },
            { onSubmit },
          );

          await submit(wrapper);

          expect(onSubmit).not.toHaveBeenCalled();
        });

        it("shouldn't call the `onSubmit` handler while a submit button linked by `form` is loading", async () => {
          const onSubmit = vi.fn();
          const wrapper = mountWithOutsideButtons([{ type: "submit", loading: true }], onSubmit);

          await submit(wrapper);

          expect(onSubmit).not.toHaveBeenCalled();
        });

        it("shouldn't call the `onSubmit` handler when another submit button is clicked while one is loading", async () => {
          const onSubmit = vi.fn();
          const wrapper = mountWithOutsideButtons(
            [{ type: "submit", loading: true }, { type: "submit" }],
            onSubmit,
          );

          wrapper.findAll("button")[1]?.element.click();
          await flushPromises();

          expect(onSubmit).not.toHaveBeenCalled();
        });

        it("should call the `onSubmit` handler when the loading button isn't a submit button", async () => {
          const onSubmit = vi.fn();
          const wrapper = mountWithOutsideButtons(
            [{ type: "button", loading: true }, { type: "submit" }],
            onSubmit,
          );

          wrapper.findAll("button")[1]?.element.click();
          await flushPromises();

          expect(onSubmit).toHaveBeenCalledOnce();
        });

        it("should call the `onSubmit` handler when another submit button is disabled but not loading", async () => {
          const onSubmit = vi.fn();
          const wrapper = mountWithOutsideButtons(
            [{ type: "submit", disabled: true }, { type: "submit" }],
            onSubmit,
          );

          wrapper.findAll("button")[1]?.element.click();
          await flushPromises();

          expect(onSubmit).toHaveBeenCalledOnce();
        });

        it("should call the `onSubmit` handler when no submit button is loading", async () => {
          const onSubmit = vi.fn();
          const wrapper = mountForm(
            { default: () => [h(TextField), h(Button, { type: "submit" })] },
            { onSubmit },
          );

          await submit(wrapper);

          expect(onSubmit).toHaveBeenCalledOnce();
        });
      });
    });
  });
});

const formId = "form-id";
const attachedWrappers: VueWrapper[] = [];

/** Mounts a form along with buttons outside it, linked to it by `form`. */
function mountWithOutsideButtons(
  buttons: Array<ComponentProps<typeof Button>>,
  onSubmit: (event: SubmitEvent) => void,
) {
  const wrapper = mount(
    () => [
      h(Form, { id: formId, onSubmit }, () => h(TextField)),
      ...buttons.map((props) => h(Button, { ...props, form: formId })),
    ],
    { attachTo: document.body, global: { plugins: [vueTestUtilsPluginUimed()] } },
  );
  attachedWrappers.push(wrapper);
  return wrapper;
}

async function submit(wrapper: VueWrapper) {
  await wrapper.find("form").trigger("submit");
  await flushPromises();
}

function mountForm(
  slots: Record<string, () => VNode | VNode[]> = {},
  attrs: Record<string, unknown> = {},
) {
  return mount(Form, {
    attrs: {
      "data-testid": testId,
      style: styleValue,
      class: classValue,
      ...attrs,
    },
    slots,
    global: {
      plugins: [vueTestUtilsPluginUimed()],
    },
  });
}
