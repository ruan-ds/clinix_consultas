// src/services/api.ts
import axios from "axios";
import { getToken } from "./tokenService";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true,
});

// Injeta o token Bearer em toda requisição autenticada
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});