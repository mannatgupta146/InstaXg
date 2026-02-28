import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// ✅ get feed
export const getFeed = async () => {
  const response = await api.get("/api/posts/feed");
  return response.data;
};

// ✅ create post
export const createPost = async (formData) => {
  const response = await api.post(
    "/api/posts",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
