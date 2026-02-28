import React, { useEffect, useContext } from "react";
import "../style/feed.scss";
import { usePost } from "../hooks/usePost";
import Post from "../components/Post";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/context/auth.context";

const Feed = () => {
  const { feed, handleGetFeed, loading } = usePost();
  const { user, loading: authLoading, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // wait until auth check completes
    if (authLoading) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    handleGetFeed();
  }, [authLoading, isAuthenticated, location.state]);

  // prevent flicker while checking auth
  if (authLoading) return null;

  if (loading) return <div className="loading">Loading...</div>;

  if (feed.length === 0)
    return <div className="loading">No posts to show</div>;

  return (
    <main className="feed-container">
      <div className="feed">
        {feed.map((post) => (
          <Post key={post._id} user={post.user} post={post} />
        ))}
      </div>
    </main>
  );
};

export default Feed;