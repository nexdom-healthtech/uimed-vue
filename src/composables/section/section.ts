import type { SectionProps, SectionVariant } from "@/components/sections/section/types.ts";
import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from "vue";
import type { VCard } from "vuetify/components";

type VCardProps = InstanceType<typeof VCard>["$props"];
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
