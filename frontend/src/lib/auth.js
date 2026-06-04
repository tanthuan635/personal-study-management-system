const REGISTERED_USER_KEY = "study-manager-registered-user";
const SESSION_USER_KEY = "study-manager-session-user";

function readJson(key) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
}

function writeJson(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export function getRegisteredUser() {
  return readJson(REGISTERED_USER_KEY);
}

export function saveRegisteredUser(user) {
  writeJson(REGISTERED_USER_KEY, user);
}

export function getSessionUser() {
  return readJson(SESSION_USER_KEY);
}

export function saveSessionUser(user) {
  writeJson(SESSION_USER_KEY, user);
}

export function clearSessionUser() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(SESSION_USER_KEY);
}

export function isAuthenticated() {
  return Boolean(getSessionUser());
}
