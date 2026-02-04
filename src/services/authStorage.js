const USERS_KEY = "petcare_users";
const AUTH_KEY = "petcare_auth";

export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
  } catch {
    return null;
  }
}

export function setAuth(auth) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

export function signup({ email, password, role = "user" }) {
  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanPassword = password || "";

  if (!cleanEmail) throw new Error("Email is required.");
  if (cleanPassword.length < 4) throw new Error("Password must be at least 4 characters.");

  const users = getUsers();
  const exists = users.some((u) => u.email.toLowerCase() === cleanEmail);
  if (exists) throw new Error("Email already registered.");

  const newUser = { email: cleanEmail, password: cleanPassword, role };
  saveUsers([...users, newUser]);

  return true;
}

export function login({ email, password }) {
  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanPassword = password || "";

  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword
  );
  if (!user) throw new Error("Invalid email or password.");

  const auth = { email: user.email, role: user.role };
  setAuth(auth);
  return auth;
}
