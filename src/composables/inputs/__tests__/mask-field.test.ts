import type { MaskFieldMask, MaskFieldProps } from "@/components/inputs/mask-field/types.ts";
import {
  getMaskPlaceholder,
  maskFieldPresets,
  resolveMask,
  toVuetifyMask,
  useMaskField,
} from "@/composables/inputs/mask-field.ts";
import { required } from "@/composables/inputs/rules.ts";
import { reactive, ref } from "vue";

const withLetters = "Nº ####";
// Every character other than `#` that the masking would otherwise read as special
const withSpecialLiterals = "AaNnX\\ ##";

describe("mask-field", () => {
  describe("maskFieldPresets", () => {
    it("should provide the masks of every preset", () => {
      expect(maskFieldPresets).toEqual({
        cpf: "###.###.###-##",
        cnpj: "##.###.###/####-##",
        cep: "#####-###",
        phone: "(##) #####-####",
        date: "##/##/####",
      });
    });
  });

  describe("resolveMask", () => {
    it.each<[string, string]>([
      ["cpf", "###.###.###-##"],
      ["cnpj", "##.###.###/####-##"],
      ["cep", "#####-###"],
      ["phone", "(##) #####-####"],
      ["date", "##/##/####"],
      ["####-##/####", "####-##/####"],
      ["time", "time"],
      ["", ""],
      ["toString", "toString"],
    ])('should resolve "%s" to the mask "%s"', (mask, resolved) => {
      expect(resolveMask(mask)).toBe(resolved);
    });
  });

  describe("toVuetifyMask", () => {
    it.each<[string, string]>([
      ["###.###.###-##", "###.###.###-##"],
      [withLetters, String.raw`\Nº ####`],
      ["A-a-N-n-X", String.raw`\A-\a-\N-\n-\X`],
      [String.raw`#\#`, String.raw`#\\#`],
      ["Bb (cz) #", "Bb (cz) #"],
      ["", ""],
    ])('should turn mask "%s" into "%s"', (mask, vuetifyMask) => {
      expect(toVuetifyMask(mask)).toBe(vuetifyMask);
    });
  });

  describe("getMaskPlaceholder", () => {
    it.each<[string, string]>([
      ["###.###.###-##", "000.000.000-00"],
      ["(##) #####-####", "(00) 00000-0000"],
      [withLetters, "Nº 0000"],
      [withSpecialLiterals, String.raw`AaNnX\ 00`],
      ["0800 ###-####", "0800 000-0000"],
      ["", ""],
    ])('should turn mask "%s" into the placeholder "%s"', (mask, placeholder) => {
      expect(getMaskPlaceholder(mask)).toBe(placeholder);
    });
  });

  describe("useMaskField", () => {
    describe("displayValue", () => {
      it.each<[MaskFieldMask, string, string]>([
        ["cpf", "12345678909", "123.456.789-09"],
        ["cpf", "123.456.789-09", "123.456.789-09"],
        ["cpf", "123", "123."],
        ["cpf", "", ""],
        ["phone", "11912345678", "(11) 91234-5678"],
        ["phone", "1", "(1"],
        ["date", "31122026", "31/12/2026"],
        [withLetters, "1234", "Nº 1234"],
        [withLetters, "Nº 1234", "Nº 1234"],
        [withLetters, "12", "Nº 12"],
        [withSpecialLiterals, "12", "AaNnX\\ 12"],
        [withSpecialLiterals, "ab1d2", "AaNnX\\ 12"],
        ["##X##", "1234", "12X34"],
        ["##X##", "12/34", "12X34"],
        ["cpf", "123.456.789-0999abc", "123.456.789-09"],
      ])('should display with mask "%s" the model "%s" as "%s"', (mask, modelValue, display) => {
        const { displayValue } = useMaskField(fieldProps({ mask }), ref(modelValue));

        expect(displayValue.value).toBe(display);
      });

      it.each(["cpf", withLetters] as const)(
        'should display a null model as empty with mask "%s"',
        (mask) => {
          // A model from an API or from JavaScript may be `null`, out of the prop's type
          const model = ref<string>(null as unknown as string);
          const { displayValue } = useMaskField(fieldProps({ mask }), model);

          expect(displayValue.value).toBe("");
        },
      );

      it("should follow the mask, keeping the model", () => {
        const props = fieldProps();
        const model = ref("12345678");
        const { displayValue } = useMaskField(props, model);

        expect(displayValue.value).toBe("123.456.78");

        props.mask = "cep";
        expect(displayValue.value).toBe("12345-678");
        expect(model.value).toBe("12345678");
      });

      it("should take a value that isn't a preset of ours as the mask itself", () => {
        const props = fieldProps({ mask: "time" as MaskFieldMask });
        const { displayValue, placeholder } = useMaskField(props, ref("1234"));

        expect(displayValue.value).toBe("time");
        expect(placeholder.value).toBe("time");
      });

      it("should read a literal that the next token accepts as the literal", () => {
        const { displayValue } = useMaskField(
          fieldProps({ mask: "0800 ###-####" }),
          ref("0800123"),
        );

        expect(displayValue.value).toBe("0800 123-");
      });
    });

    describe("placeholder", () => {
      it("should default to the mask with zeros in the digit positions", () => {
        const props = fieldProps();
        const { placeholder } = useMaskField(props, ref(""));

        expect(placeholder.value).toBe("000.000.000-00");

        props.mask = withLetters;
        expect(placeholder.value).toBe("Nº 0000");
      });

      it.each(["Digite o CPF", ""])('should use the given placeholder "%s"', (given) => {
        const { placeholder } = useMaskField(fieldProps({ placeholder: given }), ref(""));

        expect(placeholder.value).toBe(given);
      });
    });

    describe("rules", () => {
      it("should validate only the format by default", () => {
        const { rules } = useMaskField(fieldProps(), ref(""));

        expect(rules.value).toHaveLength(2);
        expect(rules.value).not.toContain(required);
      });

      it("should require a value when required", () => {
        const { rules } = useMaskField(fieldProps({ required: true }), ref(""));

        expect(rules.value).toHaveLength(3);
        expect(rules.value[0]).toBe(required);
      });

      it.each<[MaskFieldMask, string, true | string, true | string]>([
        ["cpf", "", true, true],
        ["cpf", "1", "Valor incompleto", true],
        ["cpf", "1234567890", "Valor incompleto", true],
        ["cpf", "12345678909", true, true],
        ["cpf", "123.456.789-09", true, true],
        ["cpf", "123456789099", true, "Valor inválido"],
        ["cpf", "123a", true, "Valor inválido"],
        [withLetters, "1234", true, true],
        [withLetters, "Nº 1234", true, true],
        [withLetters, "123", "Valor incompleto", true],
        [withLetters, "12345", true, "Valor inválido"],
        [withLetters, "a1234", true, "Valor inválido"],
        [withSpecialLiterals, "12", true, true],
        [withSpecialLiterals, "1", "Valor incompleto", true],
      ])(
        'should validate with mask "%s" the value "%s" as %s and %s',
        (mask, value, ...results) => {
          const [incompleteRule, invalidRule] = useMaskField(fieldProps({ mask }), ref("")).rules
            .value;

          expect([incompleteRule(value), invalidRule(value)]).toEqual(results);
        },
      );

      it("should follow the mask", () => {
        const props = fieldProps({ mask: "cep" });
        const { rules } = useMaskField(props, ref(""));

        expect(rules.value[0]("01310100")).toBe(true);
        expect(rules.value[1]("01310100")).toBe(true);

        props.mask = "####";
        expect(rules.value[0]("0131")).toBe(true);
        expect(rules.value[1]("01310100")).toBe("Valor inválido");
      });
    });

    describe("onInput", () => {
      it.each<{
        name: string;
        mask: MaskFieldMask;
        from: [string, string, number, string];
        to: [string, number, string];
      }>([
        {
          name: "types at the end",
          mask: "cpf",
          from: ["123", "1234", 4, "insertText"],
          to: ["123.4", 5, "1234"],
        },
        {
          name: "shows the literal after a group",
          mask: "cpf",
          from: ["12", "123", 3, "insertText"],
          to: ["123.", 4, "123"],
        },
        {
          name: "types in the middle",
          mask: "phone",
          from: ["1191234567", "(11) 891234-567", 6, "insertText"],
          to: ["(11) 89123-4567", 6, "11891234567"],
        },
        {
          name: "skips the literal after the typed character",
          mask: "cpf",
          from: ["1245", "123.45", 3, "insertText"],
          to: ["123.45", 4, "12345"],
        },
        {
          name: "drops the last character of a full mask",
          mask: "cep",
          from: ["01310100", "013910-100", 4, "insertText"],
          to: ["01391-010", 4, "01391010"],
        },
        {
          name: "types a letter",
          mask: withLetters,
          from: ["12", "Nº 12a", 6, "insertText"],
          to: ["Nº 12", 5, "12"],
        },
        {
          name: "types the letter of a literal where it's expected",
          mask: withLetters,
          from: ["", "N", 1, "insertText"],
          to: ["", 0, ""],
        },
        {
          name: "types a separator where the mask has another literal",
          mask: "##X##",
          from: ["12", "12X/", 4, "insertText"],
          to: ["12X", 3, "12"],
        },
        {
          name: "fills a leading literal",
          mask: "phone",
          from: ["", "1", 1, "insertText"],
          to: ["(1", 2, "1"],
        },
        {
          name: "fills leading letters",
          mask: withLetters,
          from: ["", "1", 1, "insertText"],
          to: ["Nº 1", 4, "1"],
        },
        {
          name: "fills literals that the masking would otherwise read as special",
          mask: withSpecialLiterals,
          from: ["", "1", 1, "insertText"],
          to: ["AaNnX\\ 1", 8, "1"],
        },
        {
          name: "deletes backwards",
          mask: "cpf",
          from: ["1234", "12.4", 2, "deleteContentBackward"],
          to: ["124.", 2, "124"],
        },
        {
          name: "deletes the last character",
          mask: "phone",
          from: ["1", "(", 1, "deleteContentBackward"],
          to: ["", 0, ""],
        },
        {
          name: "pastes cutting the excess",
          mask: "cpf",
          from: ["", "1234567890999", 13, "insertFromPaste"],
          to: ["123.456.789-09", 14, "12345678909"],
        },
        {
          name: "pastes a formatted value",
          mask: "phone",
          from: ["", "(11) 91234-5678", 15, "insertFromPaste"],
          to: ["(11) 91234-5678", 15, "11912345678"],
        },
        {
          name: "cuts a selection",
          mask: "cpf",
          from: ["12345678909", "123..789-09", 4, "deleteByCut"],
          to: ["123.789.09", 4, "12378909"],
        },
      ])("should mask the input when the user $name", ({ mask, from, to }) => {
        const [modelValue, value, caret, inputType] = from;
        const [masked, maskedCaret, newModelValue] = to;
        const model = ref(modelValue);
        const { onInput } = useMaskField(fieldProps({ mask }), model);
        const input = createInput(value, caret);

        onInput(inputEvent(input, inputType));

        expect(input.value).toBe(masked);
        expect([input.selectionStart, input.selectionEnd]).toEqual([maskedCaret, maskedCaret]);
        expect(model.value).toBe(newModelValue);
      });

      it("should emit the value without the literals", () => {
        const model = ref("123");
        const { onInput } = useMaskField(fieldProps(), model);

        onInput(inputEvent(createInput("123.4", 5), "insertText"));
        expect(model.value).toBe("1234");

        const lettersModel = ref("");
        const lettersField = useMaskField(fieldProps({ mask: withLetters }), lettersModel);

        lettersField.onInput(inputEvent(createInput("Nº 1234", 7), "insertFromPaste"));
        expect(lettersModel.value).toBe("1234");
      });

      it("should only move the caret when deleting a literal backwards", () => {
        const model = ref("123");
        const { onInput } = useMaskField(fieldProps(), model);
        const input = createInput("123", 3);

        onInput(inputEvent(input, "deleteContentBackward"));

        expect(input.value).toBe("123.");
        expect(input.selectionStart).toBe(3);
        expect(model.value).toBe("123");
      });

      it("should skip a literal when deleting it forwards", () => {
        const model = ref("123456");
        const { onInput } = useMaskField(fieldProps(), model);
        const input = createInput("123456", 3);

        onInput(inputEvent(input, "deleteContentForward"));

        expect(input.value).toBe("123.456.");
        expect(input.selectionStart).toBe(4);
        expect(model.value).toBe("123456");
      });

      it("should discard a character the token doesn't accept, keeping the caret", () => {
        const model = ref("123");
        const { onInput } = useMaskField(fieldProps(), model);
        const input = createInput("12a3.", 3);

        onInput(inputEvent(input, "insertText"));

        expect(input.value).toBe("123.");
        expect(input.selectionStart).toBe(2);
        expect(model.value).toBe("123");
      });

      it("should ignore a character typed at the end of a full mask", () => {
        const model = ref("01310100");
        const { onInput } = useMaskField(fieldProps({ mask: "cep" }), model);
        const input = createInput("01310-1009", 10);

        onInput(inputEvent(input, "insertText"));

        expect(input.value).toBe("01310-100");
        expect(input.selectionStart).toBe(9);
        expect(model.value).toBe("01310100");
      });

      it("should keep a model out of format when its displayed value doesn't change", () => {
        const model = ref("1234567890999");
        const { onInput } = useMaskField(fieldProps(), model);
        const input = createInput("123.456.789-09a", 15);

        onInput(inputEvent(input, "insertText"));

        expect(input.value).toBe("123.456.789-09");
        expect(model.value).toBe("1234567890999");
      });

      it("should drop the excess of a model out of format when it's edited", () => {
        const model = ref("1234567890999");
        const { onInput } = useMaskField(fieldProps(), model);

        onInput(inputEvent(createInput("123.456.789-0", 13), "deleteContentBackward"));

        expect(model.value).toBe("1234567890");
      });

      it("should keep a literal that the next token accepts as the literal", () => {
        const model = ref("");
        const { onInput } = useMaskField(fieldProps({ mask: "0800 ###-####" }), model);
        const input = createInput("0", 1);

        onInput(inputEvent(input, "insertText"));

        expect(input.value).toBe("");
        expect(model.value).toBe("");
      });

      it("should consider the caret at the end when the input has no caret", () => {
        const model = ref("");
        const { onInput } = useMaskField(fieldProps(), model);
        const input = createInput("1234", 1);
        Object.defineProperty(input, "selectionStart", { value: null });

        onInput(inputEvent(input, "insertText"));

        expect(input.value).toBe("123.4");
        expect(input.selectionEnd).toBe(5);
      });
    });

    describe("composition", () => {
      it("should ignore the input while composing, and mask it at the end", () => {
        const model = ref("");
        const { onInput, onCompositionEnd } = useMaskField(fieldProps(), model);
        const input = createInput("1234", 4);

        onInput(inputEvent(input, "insertCompositionText", true));

        expect(input.value).toBe("1234");
        expect(model.value).toBe("");

        onCompositionEnd(compositionEndEvent(input));

        expect(input.value).toBe("123.4");
        expect(input.selectionStart).toBe(5);
        expect(model.value).toBe("1234");
      });

      it("should skip the literal after the composed text, as when typing", () => {
        const model = ref("12");
        const { onCompositionEnd } = useMaskField(fieldProps(), model);
        const input = createInput("123", 3);

        onCompositionEnd(compositionEndEvent(input));

        expect(input.value).toBe("123.");
        expect(input.selectionStart).toBe(4);
      });
    });
  });
});

function fieldProps(props: Partial<Parameters<typeof useMaskField>[0]> = {}) {
  return reactive<Pick<MaskFieldProps, "mask" | "required" | "placeholder">>({
    mask: "cpf",
    required: false,
    ...props,
  });
}

function createInput(value: string, caret: number) {
  const input = document.createElement("input");
  input.value = value;
  input.setSelectionRange(caret, caret);
  return input;
}

function inputEvent(input: HTMLInputElement, inputType: string, isComposing = false) {
  const event = new InputEvent("input", { inputType, isComposing });
  input.dispatchEvent(event);
  return event;
}

function compositionEndEvent(input: HTMLInputElement) {
  const event = new CompositionEvent("compositionend");
  input.dispatchEvent(event);
  return event;
}
