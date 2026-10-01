import type {
  SectionProps,
  SectionTextAlign,
  SectionVariant,
} from "@/components/sections/section/types.ts";
import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from "vue";
import type { ComponentProps } from "vue-component-type-helpers";
import type { VCard } from "vuetify/components";

type VCardProps = ComponentProps<typeof VCard>;
type VuetifyVariant = NonNullable<VCardProps["variant"]>;

const sectionVariantToVuetifyVariant: Record<SectionVariant, VuetifyVariant> = {
  primary: "elevated",
  secondary: "outlined",
};

export function useSectionVariant(
  variant: MaybeRefOrGetter<SectionProps["variant"]>,
): ComputedRef<VuetifyVariant> {
  return computed(() => {
    const variantValue = toValue(variant);
    return variantValue
      ? sectionVariantToVuetifyVariant[variantValue]
      : sectionVariantToVuetifyVariant.primary;
  });
}

type SectionTextAlignClasses = {
  /** Text alignment utility class for the card (`text-*`). */
  content: string;
  /** Justify utility class for the actions area (`justify-*`). */
  actions: string;
};

const sectionTextAlignToClasses: Record<SectionTextAlign, SectionTextAlignClasses> = {
  // The actions stay at the end, as they were before `textAlign` existed
  start: { content: "text-start", actions: "justify-end" },
  center: { content: "text-center", actions: "justify-center" },
  end: { content: "text-end", actions: "justify-end" },
};

export function useSectionTextAlign(
  textAlign: MaybeRefOrGetter<SectionProps["textAlign"]>,
): ComputedRef<SectionTextAlignClasses> {
  return computed(() => {
    const textAlignValue = toValue(textAlign);
    return textAlignValue
      ? sectionTextAlignToClasses[textAlignValue]
      : sectionTextAlignToClasses.start;
  });
}
