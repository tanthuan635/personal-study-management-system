import axios from "axios";

import { clearSessionUser } from "../lib/auth";
import { getToken, removeToken } from "../utils/tokenStorage";

const PUBLIC_AUTH_ENDPOINTS = ["/auth/login", "/auth/register"];
let isRedirectingToLogin = false;

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5050/api",
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || "";
    const isPublicAuthRequest = PUBLIC_AUTH_ENDPOINTS.some((endpoint) =>
      requestUrl.endsWith(endpoint),
    );

    if (error.response?.status === 401 && !isPublicAuthRequest) {
      removeToken();
      clearSessionUser();

      const isGuestPage =
        typeof window !== "undefined" &&
        ["/login", "/register"].includes(window.location.pathname);

      if (
        typeof window !== "undefined" &&
        !isGuestPage &&
        !isRedirectingToLogin &&
        typeof window.location.replace === "function"
      ) {
        isRedirectingToLogin = true;
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
