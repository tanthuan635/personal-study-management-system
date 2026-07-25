import apiClient from "./apiClient";

export function register(credentials) {
  return apiClient.post("/auth/register", credentials);
}

export function login(credentials) {
  return apiClient.post("/auth/login", credentials);
}

export function getMe() {
  return apiClient.get("/auth/me");
}
