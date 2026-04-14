import { api } from "./api";

//esse tipo serve para verificar se os argumentos passados do data estão corretos
type CreateAccountData = {
  access: {
    email: string;
    password: string;
  };
};

export function createAccount(data: CreateAccountData) {
  return api.post("/registration/patient_access", data);
}