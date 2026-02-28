import React, { useEffect, useState, useContext } from "react"
import "../style/userProfile.scss"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import { AuthContext } from "../../auth/context/auth.context"

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
})

const UserProfile = () => {
  const { username } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useContext(AuthContext)

  const [user, setUser] = useState(null)
  const [requests, setRequests] = useState([])
  const [posts, setPosts] = useState([])
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)
  const [editBio, setEditBio] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [profilePicFile, setProfilePicFile] = useState(null)

  const [followStatus, setFollowStatus] = useState(null)
  // null | pending | accepted
  const [followLoading, setFollowLoading] = useState(false)

  useEffect(() => {
    // If username param exists, load that user's profile
    if (username) {
      loadUserProfile(username)
    } else {
      // Load current user's profile
      loadProfile()
    }
  }, [username, currentUser])

  const loadProfile = async () => {
    try {
      const profileRes = await api.get("/api/users/profile")
      const userData = profileRes.data.user

      console.log("👤 User:", userData)

      const postsRes = await api.get(`/api/posts/user/${userData.username}`)
      console.log("📸 Posts Response:", postsRes.data)

      const followersRes = await api.get("/api/users/followers")
      const followingRes = await api.get("/api/users/following")
      const requestsRes = await api.get("/api/users/follow/requests")
      setRequests(requestsRes.data.requests || [])

      setUser(userData)
      setPosts(postsRes.data.posts || [])
      setFollowers(followersRes.data.followers || [])
      setFollowing(followingRes.data.following || [])

      console.log(
        "✅ Profile loaded - Posts count:",
        postsRes.data.posts?.length || 0,
      )
    } catch (err) {
      console.error("❌ PROFILE LOAD ERROR:", err.message)
      console.error("Status:", err.response?.status)
      console.error("Data:", err.response?.data)
    }
  }

  const loadUserProfile = async (userToLoad) => {
    try {
      const userRes = await api.get(`/api/users/profile`)
      const allUsers = userRes.data.user // This is the current user

      // If we're viewing another user, fetch their posts
      const postsRes = await api.get(`/api/posts/user/${userToLoad}`)

      setUser({
        username: userToLoad,
        profilePic: postsRes.data.posts[0]?.profilePic || null,
      })
      setPosts(postsRes.data.posts || [])

      // Check if current user is following this user
      const relationRes = await api.get("/api/users/all")

      const relation = relationRes.data.find((u) => u.username === userToLoad)

      setFollowStatus(relation?.followStatus || null)
    } catch (err) {
      console.error("❌ Error loading user profile:", err)
    }
  }

  const handleDeletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return
    try {
      await api.delete(`/api/posts/${id}`)
      setPosts(posts.filter((p) => p._id !== id))
      console.log("✅ Post deleted")
    } catch (err) {
      console.error("Error deleting post:", err)
    }
  }

  const handleEditProfile = async () => {
    try {
      if (editBio) {
        await api.patch("/api/users/profile", { bio: editBio })
        setUser({ ...user, bio: editBio })
      }

      if (profilePicFile) {
        const formData = new FormData()
        formData.append("profilePic", profilePicFile)
        const res = await api.patch("/api/users/profile", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        setUser(res.data.user)
      }

      setIsEditing(false)
      setProfilePicFile(null)
      console.log("✅ Profile updated")
    } catch (err) {
      console.error("Edit error:", err)
      alert(
        "Error updating profile: " +
          (err.response?.data?.message || err.message),
      )
    }
  }

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // If user is editing via modal, keep it in state for preview.
      // If user clicked the small change button on their profile, upload immediately.
      if (isOwnProfile && !isEditing) {
        uploadProfilePic(file)
      } else {
        setProfilePicFile(file)
      }
    }
  }

  const uploadProfilePic = async (file) => {
    try {
      const formData = new FormData()
      formData.append("profilePic", file)
      // show temporary preview immediately
      setProfilePicFile(file)
      const res = await api.patch("/api/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setUser(res.data.user)
      setProfilePicFile(null)
      console.log("✅ Profile picture updated")
    } catch (err) {
      console.error("Upload error:", err)
      alert(err.response?.data?.message || "Error uploading profile picture")
      setProfilePicFile(null)
    }
  }

  const handleFollow = async () => {
    setFollowLoading(true)

    try {
      // unfollow OR cancel request
      if (followStatus === "accepted" || followStatus === "pending") {
        await api.post(`/api/users/unfollow/${user.username}`)
        setFollowStatus(null)
      } else {
        await api.post(`/api/users/follow/${user.username}`)
        setFollowStatus("pending") // until accepted
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error updating follow")
    } finally {
      setFollowLoading(false)
    }
  }

  const handleUnfollowUser = async (usernameToUnfollow) => {
    if (!window.confirm(`Unfollow ${usernameToUnfollow}?`)) return
    try {
      await api.post(`/api/users/unfollow/${usernameToUnfollow}`)
      setFollowing((prev) =>
        prev.filter((f) => f.followee !== usernameToUnfollow),
      )
      // If viewing own profile and unfollowed someone, also adjust UI feedback
      console.log("✅ Unfollowed:", usernameToUnfollow)
    } catch (err) {
      console.error("Unfollow error:", err)
      alert(err.response?.data?.message || "Error unfollowing user")
    }
  }

  const handleRemoveFollower = async (followerUsername) => {
    if (!window.confirm(`Remove ${followerUsername}?`)) return

    try {
      await api.post(`/api/users/remove-follower/${followerUsername}`)

      setFollowers((prev) =>
        prev.filter((f) => f.follower !== followerUsername),
      )
    } catch (err) {
      console.error(err)
    }
  }

  const handleRequestAction = async (requestId, status) => {
    try {
      await api.patch(`/api/users/follow/request/${requestId}`, { status })

      // remove request instantly
      setRequests((prev) => prev.filter((r) => r._id !== requestId))

      // 🔥 refresh followers & counts instantly
      const followersRes = await api.get("/api/users/followers")
      setFollowers(followersRes.data.followers || [])
    } catch (err) {
      console.error(err)
    }
  }

  const isOwnProfile = currentUser?.username === user?.username

  if (!user) return <div className="loading">Loading...</div>

  return (
    <div className="profile-container">
      {/* HEADER */}
      <div className="profile-header">
        <div className="profile-pic-section">
          <img
            className="profile-img"
            src={
              user.profilePic ||
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23e0e0e0' width='100' height='100'/%3E%3Ccircle cx='50' cy='35' r='20' fill='%23999'/%3E%3Cpath d='M 20 100 Q 20 60 50 60 Q 80 60 80 100' fill='%23999'/%3E%3C/svg%3E"
            }
            alt="profile"
          />
        </div>

        <div className="profile-info">
          <div className="header-top">
            <div className="user-title">
              <h2>{user.username}</h2>
              {user.name && <div className="display-name">{user.name}</div>}
            </div>
            {isOwnProfile ? (
              <button
                className="edit"
                onClick={() => {
                  setEditBio(user.bio || "")
                  setIsEditing(true)
                }}
              >
                Edit Profile
              </button>
            ) : (
              <button
                className={`action ${
                  followStatus === "accepted" ? "following" : "follow"
                }`}
                onClick={handleFollow}
                disabled={followLoading}
              >
                {followLoading
                  ? "..."
                  : followStatus === "accepted"
                    ? "Following"
                    : followStatus === "pending"
                      ? "Requested"
                      : "Follow"}
              </button>
            )}
          </div>

          <div className="stats">
            <span>
              <strong>{posts.length}</strong> posts
            </span>

            <span
              onClick={() => setShowFollowers(!showFollowers)}
              style={{ cursor: "pointer" }}
            >
              <strong>{followers.length}</strong> followers
            </span>

            <span
              onClick={() => setShowFollowing(!showFollowing)}
              style={{ cursor: "pointer" }}
            >
              <strong>{following.length}</strong> following
            </span>
          </div>

          <p className="bio">{user.bio || "No bio yet"}</p>
        </div>
      </div>

      {/* EDIT BIO MODAL */}
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Edit Profile</h3>
            </div>

            <div className="modal-body">
              <div className="current-pic">
                <img
                  src={
                    profilePicFile
                      ? URL.createObjectURL(profilePicFile)
                      : user.profilePic ||
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23e0e0e0' width='100' height='100'/%3E%3Ccircle cx='50' cy='35' r='20' fill='%23999'/%3E%3Cpath d='M 20 100 Q 20 60 50 60 Q 80 60 80 100' fill='%23999'/%3E%3C/svg%3E"
                  }
                  alt="profile preview"
                />
              </div>

              <label className="upload">
                Choose new picture
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  hidden
                />
              </label>

              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Write your bio..."
              />
            </div>

            <div className="modal-buttons">
              <button onClick={handleEditProfile} className="save">
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setProfilePicFile(null)
                }}
                className="cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isOwnProfile && requests.length > 0 && (
        <div className="list-box">
          <h3>Follow Requests</h3>

          {requests.map((req) => (
            <div key={req._id} className="request-item">
              <span>{req.follower}</span>

              <div className="request-actions">
                <button
                  className="accept"
                  onClick={() => handleRequestAction(req._id, "accepted")}
                >
                  Accept
                </button>

                <button
                  className="reject"
                  onClick={() => handleRequestAction(req._id, "rejected")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FOLLOWERS LIST */}
      {showFollowers && (
        <div className="list-box">
          <h3>Followers</h3>
          {followers.map((f) => (
            <div key={f.follower} className="follower-item">
              <span>{f.follower}</span>
              {isOwnProfile && (
                <button
                  className="remove"
                  onClick={() => handleRemoveFollower(f.follower)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* FOLLOWING LIST */}
      {showFollowing && (
        <div className="list-box">
          <h3>Following</h3>
          {following.map((f) => (
            <div key={f.followee} className="following-item">
              <span>{f.followee}</span>
              {isOwnProfile && (
                <button
                  className="unfollow-item"
                  onClick={() => handleUnfollowUser(f.followee)}
                >
                  Unfollow
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* POSTS GRID */}
      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post._id} className="post-item">
            <img src={post.imgUrl} alt="" />
            {isOwnProfile && (
              <button
                className="delete"
                onClick={() => handleDeletePost(post._id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserProfile
