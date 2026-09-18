import type { ContentSetProps, ContentSetVariant } from "@/components/content/types.ts";
import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from "vue";
import type { VCard } from "vuetify/components";

type VCardProps = InstanceType<typeof VCard>["$props"];
type VuetifyVariant = NonNullable<VCardProps["variant"]>;

const contentSetVariantToVuetifyVariant: Record<ContentSetVariant, VuetifyVariant> = {
  primary: "elevated",
  secondary: "outlined",
};

export function useContentSetVariant(
  variant: MaybeRefOrGetter<ContentSetProps["variant"]>,
): ComputedRef<VuetifyVariant> {
  return computed(() => {
    const variantValue = toValue(variant);
    return variantValue
      ? contentSetVariantToVuetifyVariant[variantValue]
      : contentSetVariantToVuetifyVariant.primary;
  });
}
