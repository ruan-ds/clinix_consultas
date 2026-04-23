import { describe, it, expect, vi, beforeEach } from "vitest";
import { createAccount } from "../auth";
import { api } from "../api";

// mock da API (evita chamada real)
vi.mock("../api", () => ({
  api: {
    post: vi.fn()
  }
}));

describe("createAccount", () => {
  // limpa os mocks antes de cada teste
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve chamar a API com os dados corretos", async () => {
    const data = {
      person: {
        name: "Natã",
        cpf: "12345678900",
        sex: "M",
        birthday: "2000-01-01"
      },
      address: {
        state: "MG",
        city: "Belo Horizonte",
        neighborhood: "Centro",
        street: "Rua A",
        number: "123",
        complement: "",
        cep: "30100000"
      },
      phone: {
        phone: "31999999999",
        type: "mobile"
      },
      access: {
        email: "teste@email.com",
        password: "123456"
      }
    };

    await createAccount(data);

    expect(api.post).toHaveBeenCalledWith(
      "/registration/patient_access",
      data
    );
  });

  it("deve lidar com erro da API", async () => {
    (api.post as any).mockRejectedValue(new Error("Erro na API"));

    const data = {} as any;

    await expect(createAccount(data)).rejects.toThrow("Erro na API");
  });

  it("deve retornar os dados quando a API responde com sucesso", async () => {
    const response = {
      data: { message: "Conta criada com sucesso" }
    };

    (api.post as any).mockResolvedValue(response);

    const data = {} as any;

    const result = await createAccount(data);

    expect(result).toEqual(response);
  });
});