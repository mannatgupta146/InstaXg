import api from "../../../api";

// get feed
export const getFeed = async () => {
  const res = await api.get("/api/posts/feed");
  return res.data;
};

// create post
export const createPost = async (formData) => {
  const res = await api.post("/api/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};