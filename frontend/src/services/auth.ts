import { api } from "./api";

//esse tipo serve para verificar se os argumentos passados do data estão corretos
type CreateAccountData = {
  person:{
    name:string;
    cpf: string;
    sex: string;
    birthday: string;
  }
  access: {
    email: string;
    password: string;
  };
};

export function createAccount(data: CreateAccountData) {
  return api.post("/registration/patient_access", data);
}