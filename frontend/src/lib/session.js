export const AUTH_KEY = "sg_auth_v1";

export function setAuth(token, user) {
  const payload = { token, user, lastActivity: Date.now() };
  localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
}

export function getAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

export function updateActivity() {
  const s = getAuth();
  if (!s) return;
  s.lastActivity = Date.now();
  localStorage.setItem(AUTH_KEY, JSON.stringify(s));
}

export function getToken() {
  const s = getAuth();
  return s?.token || null;
}
