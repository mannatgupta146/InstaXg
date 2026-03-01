import React, { useEffect, useContext } from "react";
import "../style/feed.scss";
import { usePost } from "../hooks/usePost";
import Post from "../components/Post";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/context/auth.context";

const Feed = () => {
  const { feed, handleGetFeed, loading } = usePost();
  const { loading: authLoading, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    handleGetFeed();

    // clear refresh flag after post creation
    if (location.state?.refresh) {
      window.history.replaceState({}, document.title);
    }

  }, [authLoading, isAuthenticated]);

  if (authLoading) return null;

  if (loading) return <div className="loading">Loading feed...</div>;

  if (feed.length === 0)
    return <div className="loading">No posts to show</div>;

  return (
    <main className="feed-container">
      <div className="feed">
        {feed.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </main>
  );
};

export default Feed;