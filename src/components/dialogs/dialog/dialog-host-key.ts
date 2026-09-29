import type { DialogHostContext } from "@/components/dialogs/dialog/types.ts";
import type { InjectionKey } from "vue";

/**
 * Injection key of {@link DialogHostContext}, provided by the internal `DialogHost`. Besides the
 * role, the blocking while an action runs and the end of the leave transitions, it makes the
 * dialog's content describe the dialog (`aria-describedby`), since `DialogHost` only displays text
 * messages. Not part of the public API.
 */
export const dialogHostKey: InjectionKey<DialogHostContext> = Symbol("dialog-host");
