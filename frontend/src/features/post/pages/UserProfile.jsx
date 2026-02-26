import React, { useEffect, useState } from "react";
import "../style/userProfile.scss";
import { api } from "../services/post.api";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [requests, setRequests] = useState([]);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const username = storedUser?.username;

useEffect(() => {
  if (!username) {
    console.log("No username found");
    return;
  }

  loadProfile();
}, [username]);

  const loadProfile = async () => {
    try {
      const followersRes = await api.get("/api/users/followers");
      const followingRes = await api.get("/api/users/following");
      const requestsRes = await api.get("/api/users/follow/requests");
      const postsRes = await api.get(`/api/posts/user/${username}`);

      setFollowers(followersRes.data.followers || []);
      setFollowing(followingRes.data.following || []);
      setRequests(requestsRes.data.requests || []);
      setPosts(postsRes.data.posts || []);

      setUser({
        username,
        bio: "Building InstaXG 🚀",
        profilePic: "https://i.pravatar.cc/150?img=5",
      });

    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestUpdate = async (id, status) => {
    try {
      await api.patch(`/api/users/follow/request/${id}`, { status });
      setRequests(requests.filter(r => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const deletePost = async (postId) => {
    try {
      await api.delete(`/api/posts/${postId}`);
      setPosts(posts.filter(p => p._id !== postId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-container">

      {/* HEADER */}
      <div className="profile-header">
        <img className="profile-img" src={user.profilePic} alt="" />

        <div className="profile-info">
          <h2>{user.username}</h2>

          <div className="stats">
            <span><strong>{posts.length}</strong> posts</span>
            <span><strong>{followers.length}</strong> followers</span>
            <span><strong>{following.length}</strong> following</span>
          </div>

          <p className="bio">{user.bio}</p>

          <button className="edit-btn">Edit Profile</button>
        </div>
      </div>

      {/* FOLLOW REQUESTS */}
      {requests.length > 0 && (
        <div className="requests-section">
          <h3>Follow Requests</h3>

          {requests.map(req => (
            <div key={req._id} className="request-item">
              <span>{req.follower}</span>

              <div>
                <button
                  className="accept"
                  onClick={() => handleRequestUpdate(req._id, "accepted")}
                >
                  Accept
                </button>

                <button
                  className="reject"
                  onClick={() => handleRequestUpdate(req._id, "rejected")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* POSTS GRID */}
      <div className="posts-grid">
        {posts.map(post => (
          <div key={post._id} className="post-item">
            <img src={post.imgUrl} alt="" />

            <button
              className="delete-btn"
              onClick={() => deletePost(post._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default UserProfile;