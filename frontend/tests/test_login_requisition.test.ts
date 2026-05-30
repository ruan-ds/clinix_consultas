import { describe, it, expect, vi } from "vitest";
import { getLogin } from "../src/services/auth";
import { api } from "../src/services/api";


// mock da api
vi.mock("../src/services/api", () => ({
  api: {
    post: vi.fn(),
  },
}));

describe("Login Request", () => {
  it("deve chamar a API com os dados corretos", async () => {
    const mockResponse = {
      data: { token: "abc123" },
    };

    const mockedPost = vi.mocked(api.post);
    mockedPost.mockResolvedValue(mockResponse);

    const loginData = {
      patient_access: {
        email: "teste@email.com",
        password: "123456",
      },
    };

    const response = await getLogin(loginData);

    expect(api.post).toHaveBeenCalledWith(
      "/login/patient_access",
      loginData
    );

    expect(response.data.token).toBe("abc123");
  });

  it("deve retornar erro quando a API falhar", async () => {
    const mockedPost = vi.mocked(api.post);
    mockedPost.mockRejectedValue(new Error("Erro de login"));

    const loginData = {
      patient_access: {
        email: "erro@email.com",
        password: "errado",
      },
    };

    await expect(getLogin(loginData)).rejects.toThrow("Erro de login");
  });
});