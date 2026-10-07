import type { MaskFieldPreset, MaskFieldProps } from "@/components/inputs/mask-field/types.ts";
import { useRules } from "@/composables/inputs/fields.ts";
import type { Rule } from "@/composables/inputs/types.ts";
import { computed, type Ref } from "vue";
import { useMask } from "vuetify";

/**
 * Masks of the presets. Our preset names always map to these masks, never to
 * Vuetify's own presets (e.g. its American `phone`).
 */
export const maskFieldPresets: Record<MaskFieldPreset, string> = {
  cpf: "###.###.###-##",
  cnpj: "##.###.###/####-##",
  cep: "#####-###",
  phone: "(##) #####-####",
  date: "##/##/####",
};

/**
 * Returns the mask of a preset, or the given mask itself when it's a custom
 * one.
 *
 * It takes any string, as the `mask` prop may get one through a cast or from
 * JavaScript: a string that isn't a preset is taken as the mask.
 */
export function resolveMask(mask: string): string {
  return isMaskFieldPreset(mask) ? maskFieldPresets[mask] : mask;
}

/**
 * Returns a mask as Vuetify reads it. `#` is our only token, but Vuetify always
 * adds its own tokens (`A`, `a`, `N`, `n` and `X`) and its escape (`\`), so
 * these characters are escaped to stay literals.
 */
export function toVuetifyMask(mask: string): string {
  return mask.replaceAll(/[AaNnX\\]/g, String.raw`\$&`);
}

/**
 * Returns the default placeholder of a mask: the mask with `0` in place of each
 * `#`, keeping its literals (e.g. `000.000.000-00` for `cpf`).
 */
export function getMaskPlaceholder(mask: string): string {
  return mask.replaceAll("#", "0");
}

function isMaskFieldPreset(mask: string): mask is MaskFieldPreset {
  return Object.hasOwn(maskFieldPresets, mask);
}

/**
 * Keeps the input masked while the user edits it, emitting only the digits
 * (Vuetify's `unmask`).
 *
 * A `v-model` out of the mask's format (masked, or with characters or length
 * the mask doesn't accept) is displayed normalized, without being emitted, and
 * validated as it is, so a value that doesn't fit the mask fails validation.
 */
export function useMaskField(
  props: Pick<MaskFieldProps, "mask" | "required" | "placeholder">,
  model: Ref<string>,
) {
  const mask = computed(() => resolveMask(props.mask));
  const digitCount = computed(() => mask.value.split("#").length - 1);
  // An object mask skips Vuetify's own presets, so the `mask` prop only maps to ours
  const vuetifyMask = useMask({
    get mask() {
      return { mask: toVuetifyMask(mask.value), tokens: {} };
    },
  });

  const displayValue = computed(() => vuetifyMask.mask(unmask(model.value)));
  const placeholder = computed(() => props.placeholder ?? getMaskPlaceholder(mask.value));

  const defaultRules = useRules(props);
  const rules = computed<Array<Rule>>(() => [
    ...defaultRules.value,
    (value) => !value || !vuetifyMask.isValid(value) || isComplete(value) || "Valor incompleto",
    (value) => !value || vuetifyMask.isValid(value) || "Valor inválido",
  ]);

  function unmask(text: string): string {
    // `unmask` returns `null` for a value that isn't a string, such as a `null` model
    return vuetifyMask.unmask(text) ?? "";
  }

  // Vuetify's `isComplete` compares the masked value with the mask's length, which counts the `\`
  // of the escaped literals, so it counts the filled digits instead
  function isComplete(value: string): boolean {
    return unmask(vuetifyMask.mask(value)).length === digitCount.value;
  }

  /**
   * Returns the position in a masked text right after the given number of
   * digits, skipping the literals after it unless the user deleted backwards
   * (as Vuetify's mask input does).
   */
  function findCaret(masked: string, valueLength: number, deletedBackwards: boolean): number {
    let caret = 0;
    let found = 0;

    while (found < valueLength) {
      if (!vuetifyMask.isDelimiter(masked, caret)) found++;
      caret++;
    }

    if (!deletedBackwards) {
      while (vuetifyMask.isDelimiter(masked, caret)) caret++;
    }

    return caret;
  }

  function update(input: HTMLInputElement, deletedBackwards: boolean) {
    const caret = input.selectionStart ?? input.value.length;
    const masked = vuetifyMask.mask(unmask(input.value));
    // The caret stays after the same digits of the value, wherever the change was made
    const valueBeforeCaret = unmask(vuetifyMask.mask(unmask(input.value.slice(0, caret))));
    const newCaret = findCaret(masked, valueBeforeCaret.length, deletedBackwards);
    const value = unmask(masked);

    input.value = masked;
    input.setSelectionRange(newCaret, newCaret);

    if (value !== unmask(displayValue.value)) model.value = value;
  }

  function onInput(event: InputEvent) {
    if (!event.isComposing) {
      update(event.target as HTMLInputElement, event.inputType.endsWith("Backward"));
    }
  }

  function onCompositionEnd(event: CompositionEvent) {
    update(event.target as HTMLInputElement, false);
  }

  return { displayValue, placeholder, rules, onInput, onCompositionEnd };
}
