import type { LocaleOptions } from "vuetify";
import { pt } from "vuetify/locale";

/**
 * Language of the texts the components generate on their own, such as
 * screen reader announcements and pagination labels. Fixed in pt-BR.
 */
export const localeOptions: LocaleOptions = {
  locale: "pt-BR",
  messages: { "pt-BR": pt },
};
