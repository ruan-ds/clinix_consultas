import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../src/services/api", () => ({
  api: {
    post: vi.fn(),
  },
}));

import { api } from "../src/services/api";
import { createAccount } from "../src/services/auth";

describe("createAccount", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("deve chamar a API com os dados corretos", async () => {
    const mockPost = vi.fn();
    api.post = mockPost;
    mockPost.mockResolvedValue({ data: { success: true } });

    const data = {
      person: { name: "Natã", cpf: "12345678900", sex: "M", birthday: "2000-01-01" },
      address: { state: "MG", city: "Belo Horizonte", neighborhood: "Centro", street: "Rua A", number: "123", complement: "", cep: "30100000" },
      phone: { phone: "31999999999", type: "mobile" },
      access: { email: "teste@email.com", password: "123456" }
    };

    await createAccount(data);

    expect(mockPost).toHaveBeenCalledWith("/registration/patient_access", data);
  });

  it("deve lidar com erro da API", async () => {
    const mockPost = vi.fn();
    api.post = mockPost;
    const mockError = new Error("Network Error");
    mockPost.mockRejectedValue(mockError);

    await expect(
      createAccount({ 
        person: {}, 
        address: {}, 
        phone: {}, 
        access: {} 
      })
    ).rejects.toThrow("Network Error");
  });

  it("deve retornar os dados quando a API responde com sucesso", async () => {
    const mockPost = vi.fn();
    api.post = mockPost;
    const response = { data: { message: "Conta criada com sucesso" } };
    mockPost.mockResolvedValue(response);

    const result = await createAccount({ 
      person: {}, 
      address: {}, 
      phone: {}, 
      access: {} 
    });

    expect(result).toEqual(response);
  });
});
