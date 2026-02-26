import React, { useEffect } from "react";
import "../style/feed.scss";
import { usePost } from "../hooks/usePost";
import Post from "../components/Post";
import { useLocation } from "react-router-dom";

const Feed = () => {
  const { feed, handleGetFeed, loading } = usePost();
  const location = useLocation();

  useEffect(() => {
    handleGetFeed();
  }, [location.state]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (feed.length === 0) {
    return <div className="loading">No posts to show</div>;
  }

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