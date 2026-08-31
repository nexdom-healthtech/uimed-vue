export function required(value?: string) {
  return !!value || "Campo obrigatório";
}
