import React, { useEffect } from "react";
import "../style/feed.scss";
import { usePost } from "../hooks/usePost";
import Post from "../components/Post";

const Feed = () => {
  const { feed, handleGetFeed, loading } = usePost();

  useEffect(() => {
    handleGetFeed();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!feed || feed.length === 0) {
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