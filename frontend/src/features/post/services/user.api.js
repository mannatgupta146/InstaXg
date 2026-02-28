import { api } from "./post.api";

export const getUsers = async () => {
  const res = await api.get("/api/users/all");
  return res.data;
};

export const followUser = async (username) => {
  return api.post(`/api/users/follow/${username}`);
};

export const unfollowUser = async (username) => {
  return api.delete(`/api/users/follow/${username}`);
};