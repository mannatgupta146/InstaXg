import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});

// REGISTER
export const register = async (username, email, password) => {
  const res = await api.post("/register", {
    username,
    email,
    password,
  });

  return res.data;
};

// LOGIN
export const login = async (username, password) => {
  const res = await api.post("/login", {
    username,
    password,
  });

  return res.data;
};

// GET LOGGED USER
export const getMe = async () => {
  const res = await api.get("/get-me");
  return res.data;
};