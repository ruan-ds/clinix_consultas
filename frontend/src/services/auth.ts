import { api } from "./api";
import React from "react";

//esse tipo serve para verificar se os argumentos passados do data estão corretos
type CreateAccountData = {
  
  person:{
    name:string;
    cpf: string;
    sex: string;
    birthday: string;
  }

  address:{
    state:string;
    city:string;
    neighborhood:string;
    street:string;
    number:string;
    complement:string;
    cep:string;
  }

  phone:{
    phone:string;
    type: string;
  }

  access: {
    email: string;
    password: string;
  };

};

//requisicao do login(verificando por enquanto)
type LoginData = {
  email: string;
  password: string;
};

export function getLogin(login: LoginData) {
  console.log("Login enviado:", login);
  return api.post("/login/patient_access", login)
}

export function createAccount(data: CreateAccountData) {
  console.log("Cadastro enviado:", data);
  return api.post("/registration/patient_access", data);
}