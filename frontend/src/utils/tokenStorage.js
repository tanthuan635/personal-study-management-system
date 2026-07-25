const TOKEN_STORAGE_KEY = "study-manager-auth-token";

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function getToken() {
  if (!canUseLocalStorage()) {
    return null;
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setToken(token) {
  if (!canUseLocalStorage()) {
    return;
  }

  if (!token) {
    removeToken();
    return;
  }

  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function removeToken() {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}
