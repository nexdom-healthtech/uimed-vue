import type { DialogHostContext } from "@/components/dialogs/dialog/types.ts";
import type { InjectionKey } from "vue";

/**
 * Injection key of {@link DialogHostContext}, provided by the internal `DialogHost`. Besides the
 * role, it makes the dialog's content describe the dialog (`aria-describedby`), since
 * `DialogHost` only displays text messages. Not part of the public API.
 */
export const dialogHostKey: InjectionKey<DialogHostContext> = Symbol("dialog-host");
