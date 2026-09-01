import type { RuleResult } from "@/composables/inputs/types.ts";
import { isEmail, isEmpty, isPhone, isUrl } from "@nexdom/shared/utils";

export function required(value?: string): RuleResult {
  return !isEmpty(value) || "Campo obrigatório";
}

export function phone(value?: string): RuleResult {
  return isEmpty(value) || isPhone(value) || "Número inválido";
}

export function email(value?: string): RuleResult {
  return isEmpty(value) || isEmail(value) || "E-mail inválido";
}

export function url(value?: string): RuleResult {
  return isEmpty(value) || isUrl(value) || "URL inválida";
}
