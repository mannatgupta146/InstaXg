import api from "../../../api";

// register
export const register = async (username, email, password) => {
  const res = await api.post("/api/auth/register", {
    username,
    email,
    password,
  });
  return res.data;
};

// login
export const login = async (username, password) => {
  const res = await api.post("/api/auth/login", {
    username,
    password,
  });
  return res.data;
};

// get current user
export const getMe = async () => {
  const res = await api.get("/api/auth/get-me");
  return res.data;
};