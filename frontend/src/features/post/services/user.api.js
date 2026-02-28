import { api } from "./post.api";

// get all users with follow status
export const getUsers = async () => {
  const res = await api.get("/api/users/all");
  return res.data;
};

// send follow request
export const followUser = async (username) => {
  return api.post(`/api/users/follow/${username}`);
};

// unfollow OR cancel request
export const unfollowUser = async (username) => {
  return api.post(`/api/users/unfollow/${username}`);
};