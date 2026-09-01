import { email, phone, required, url } from "@/composables/inputs/rules.ts";

describe("rules", () => {
  describe("required", () => {
    it("shouldn't accept empty strings", () => {
      expect(required("something")).toBe(true);
      expect(required("")).toBe("Campo obrigatório");
    });
  });

  describe("phone", () => {
    it("should only accept empty string or valid phone numbers", () => {
      expect(phone("(69) 2680-8988")).toBe(true);
      expect(phone("(69) 99338-9808")).toBe(true);
      expect(phone("69993389808")).toBe(true);
      expect(phone("")).toBe(true);
      expect(phone("wrongNumber")).toBe("Número inválido");
      expect(phone("699933898")).toBe("Número inválido");
      expect(phone("118563256")).toBe("Número inválido");
    });
  });

  describe("email", () => {
    it("should only accept empty string or valid e-mail addresses", () => {
      expect(email("jennifer.emanuelly.ferreira@ativacofres.com.br")).toBe(true);
      expect(email("lorena_camila_ramos@novaface.org.br")).toBe(true);
      expect(email("amanda_dapaz.123@gmail.com")).toBe(true);
      expect(email("")).toBe(true);
      expect(email("wrongEmail")).toBe("E-mail inválido");
      expect(email("amanda_dapaz.123@gmail")).toBe("E-mail inválido");
      expect(email("_camila_ramos@novaface")).toBe("E-mail inválido");
    });
  });

  describe("url", () => {
    it("should only accept empty string or valid URL", () => {
      expect(url("https://google.com")).toBe(true);
      expect(url("https://www.google.com/search?q=uncle+bob+clean+code")).toBe(true);
      expect(url("http://localhost:8080")).toBe(true);
      expect(url("")).toBe(true);
      expect(url("htttps://google.com")).toBe("URL inválida");
      expect(url("http:///localhost:8080")).toBe("URL inválida");
      expect(url("https://.google.com/search?q=martin+fowler+refactoring")).toBe("URL inválida");
    });
  });
});
