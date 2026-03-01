import React, { useState, useEffect } from "react";
import { createPost } from "../services/post.api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../style/createPost.scss";

const CreatePost = () => {
  const navigate = useNavigate();

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // cleanup preview memory
  useEffect(() => {
    return () => preview && URL.revokeObjectURL(preview);
  }, [preview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.warning("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", image);

    const toastId = toast.loading("Uploading post...");

    try {
      setLoading(true);

      await createPost(formData);

      toast.update(toastId, {
        render: "Post shared successfully 🎉",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      navigate("/", { state: { refresh: true } });

    } catch (err) {
      toast.update(toastId, {
        render:
          err.response?.data?.message ||
          "Failed to upload post ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="create-post-container">
        <form className="create-post-card" onSubmit={handleSubmit}>
          <h2>Create Post</h2>

          {preview && (
            <div className="preview">
              <img src={preview} alt="preview" />
            </div>
          )}

          <input type="file" accept="image/*" onChange={handleImage} />

          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <button className="post-btn" disabled={loading}>
            {loading ? "Posting..." : "Share"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default CreatePost;