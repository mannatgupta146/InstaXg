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
  const [posts, setPosts] = useState([])
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)
  const [editBio, setEditBio] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [profilePicFile, setProfilePicFile] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)
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
      const followingRes = await api.get("/api/users/following")
      const isFollowingUser = followingRes.data.following.some(
        (f) => f.followee === userToLoad,
      )
      setIsFollowing(isFollowingUser)
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
      setProfilePicFile(file)
    }
  }

  const handleFollow = async () => {
    setFollowLoading(true)
    try {
      if (isFollowing) {
        await api.post(`/api/users/unfollow/${user.username}`)
        setIsFollowing(false)
        console.log("✅ Unfollowed:", user.username)
      } else {
        await api.post(`/api/users/follow/${user.username}`)
        setIsFollowing(true)
        console.log("✅ Followed:", user.username)
      }
    } catch (err) {
      console.error("Follow error:", err)
      alert(err.response?.data?.message || "Error toggling follow")
    } finally {
      setFollowLoading(false)
    }
  }

  const handleRemoveFollower = async (followerUsername) => {
    if (!window.confirm(`Remove ${followerUsername} as follower?`)) return
    try {
      // This would need a backend endpoint to remove a follower
      await api.post(`/api/users/remove-follower/${followerUsername}`)
      setFollowers(followers.filter((f) => f.follower !== followerUsername))
      console.log("✅ Removed follower")
    } catch (err) {
      console.error("Remove follower error:", err)
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
          {isOwnProfile && (
            <label className="edit-pic-label">
              📷 Change
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                hidden
              />
            </label>
          )}
        </div>

        <div className="profile-info">
          <div className="header-top">
            <h2>{user.username}</h2>
            {isOwnProfile ? (
              <button
                className="edit-btn"
                onClick={() => {
                  setEditBio(user.bio || "")
                  setIsEditing(true)
                }}
              >
                Edit Profile
              </button>
            ) : (
              <button
                className={`action-btn ${isFollowing ? "following" : "follow"}`}
                onClick={handleFollow}
                disabled={followLoading}
              >
                {followLoading ? "..." : isFollowing ? "Following" : "Follow"}
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
            <h3>Edit Profile</h3>
            {profilePicFile && (
              <div className="preview-pic">
                <img src={URL.createObjectURL(profilePicFile)} alt="preview" />
              </div>
            )}
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              placeholder="Write your bio..."
            />
            <div className="modal-buttons">
              <button onClick={handleEditProfile} className="save-btn">
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setProfilePicFile(null)
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
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
                  className="remove-btn"
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
                  className="unfollow-item-btn"
                  onClick={() => handleFollow()}
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
                className="delete-btn"
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
