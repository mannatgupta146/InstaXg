import React, { useEffect, useState, useContext } from "react"
import "../style/userProfile.scss"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import { AuthContext } from "../../auth/context/auth.context"
import { toast } from "react-toastify"

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
  const [savedPosts, setSavedPosts] = useState([])
  const [showSaved, setShowSaved] = useState(false)

  const [followStatus, setFollowStatus] = useState(null)
  // null | pending | accepted
  const [followLoading, setFollowLoading] = useState(false)

  useEffect(() => {
    if (username && username !== currentUser?.username) {
  loadUserProfile(username)
} else {
  loadProfile()   // loads requests too
}
  }, [username, currentUser])

  const loadSavedPosts = async () => {
    try {
      const res = await api.get("/api/posts/saved")
      setSavedPosts(res.data.posts || [])
    } catch {
      toast.error("Failed to load saved posts")
    }
  }

  const loadProfile = async () => {
    try {
      const profileRes = await api.get("/api/users/profile")
      const userData = profileRes.data.user

      const postsRes = await api.get(`/api/posts/user/${userData.username}`)
      const followersRes = await api.get("/api/users/followers")
      const followingRes = await api.get("/api/users/following")
      const requestsRes = await api.get("/api/users/follow/requests")

      setUser(userData)
      setPosts(postsRes.data.posts || [])
      setFollowers(followersRes.data.followers || [])
      setFollowing(followingRes.data.following || [])
      setRequests(requestsRes.data.requests || [])

      await loadSavedPosts()
    } catch (err) {
      toast.error("Failed to load profile")
    }
  }

  const toggleSave = async (postId) => {
    try {
      await api.post(`/api/posts/save/${postId}`)

      setSavedPosts((prev) => prev.filter((p) => p._id !== postId))

      toast.info("Removed from saved")
    } catch {
      toast.error("Action failed")
    }
  }

  const loadUserProfile = async (userToLoad) => {
    try {
      // run requests in parallel (faster ⚡)
      const [postsRes, relationRes] = await Promise.all([
        api.get(`/api/posts/user/${userToLoad}`),
        api.get("/api/users/all"),
      ])

      const postsData = postsRes.data.posts || []

      setUser({
        username: userToLoad,
        profilePic: postsData[0]?.profilePic || null,
      })

      setPosts(postsData)

      // find relation safely
      const relation = relationRes.data.find((u) => u.username === userToLoad)

      setFollowStatus(relation?.followStatus ?? null)
    } catch (err) {
      console.error("Error loading user profile:", err)

      toast.error(err.response?.data?.message || "Failed to load user profile")
    }
  }

  const handleDeletePost = async (id) => {
    const confirmDelete = window.confirm("Delete this post?")
    if (!confirmDelete) return

    try {
      // remove instantly from UI (fast UX)
      setPosts((prev) => prev.filter((post) => post._id !== id))

      await api.delete(`/api/posts/${id}`)

      toast.success("Post deleted successfully 🗑️")
    } catch (err) {
      console.error("Delete error:", err)

      toast.error(err.response?.data?.message || "Failed to delete post")

      // reload posts if delete failed
      loadProfile()
    }
  }

  const handleEditProfile = async () => {
    try {
      const formData = new FormData()

      // only append if changed
      if (editBio !== user.bio) {
        formData.append("bio", editBio)
      }

      if (profilePicFile) {
        formData.append("profilePic", profilePicFile)
      }

      // if nothing changed → stop
      if (![...formData.keys()].length) {
        toast.info("No changes made")
        return
      }

      const res = await api.patch("/api/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setUser(res.data.user)
      setIsEditing(false)
      setProfilePicFile(null)

      toast.success("Profile updated successfully ✨")
    } catch (err) {
      console.error("Edit error:", err)

      toast.error(err.response?.data?.message || "Profile update failed")
    }
  }

  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // ✅ allow only images
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file")
      return
    }

    // ✅ limit size (2MB)
    const maxSize = 2 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error("Image must be under 2MB")
      return
    }

    // preview instantly
    setProfilePicFile(file)

    // upload immediately if not editing modal
    if (isOwnProfile && !isEditing) {
      uploadProfilePic(file)
      toast.info("Uploading profile picture...")
    }
  }

  const uploadProfilePic = async (file) => {
    const toastId = toast.loading("Uploading profile picture...")

    try {
      const formData = new FormData()
      formData.append("profilePic", file)

      const res = await api.patch("/api/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },

        // ✅ upload progress (optional but great UX)
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          )
          toast.update(toastId, {
            render: `Uploading... ${percent}%`,
          })
        },
      })

      setUser(res.data.user)

      toast.update(toastId, {
        render: "Profile picture updated 🎉",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      })
    } catch (err) {
      console.error("Upload error:", err)

      toast.update(toastId, {
        render:
          err.response?.data?.message || "Failed to upload profile picture",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      })
    }
  }

  const handleFollow = async () => {
    if (followLoading) return // 🛑 prevent double clicks

    setFollowLoading(true)

    try {
      // ✅ Already following → unfollow
      if (followStatus === "accepted") {
        await api.post(`/api/users/unfollow/${user.username}`)
        setFollowStatus(null)
        toast.info("Unfollowed")
        return
      }

      // ✅ Request pending → cancel request
      if (followStatus === "pending") {
        await api.post(`/api/users/unfollow/${user.username}`)
        setFollowStatus(null)
        toast.info("Follow request cancelled")
        return
      }

      // ✅ Send follow request
      await api.post(`/api/users/follow/${user.username}`)
      setFollowStatus("pending")
      toast.success("Follow request sent")
    } catch (err) {
      console.error(err)

      toast.error(
        err.response?.data?.message || "Something went wrong. Try again.",
      )
    } finally {
      setFollowLoading(false)
    }
  }

  const handleUnfollowUser = async (usernameToUnfollow) => {
    const confirm = window.confirm(`Unfollow ${usernameToUnfollow}?`)
    if (!confirm) return

    try {
      // 🔥 API call
      await api.post(`/api/users/unfollow/${usernameToUnfollow}`)

      // 🔥 instant UI update
      setFollowing((prev) =>
        prev.filter((f) => f.followee !== usernameToUnfollow),
      )

      toast.info(`Unfollowed ${usernameToUnfollow}`)
    } catch (err) {
      console.error(err)

      toast.error(
        err.response?.data?.message || "Failed to unfollow. Try again.",
      )
    }
  }

  const handleRemoveFollower = async (followerUsername) => {
    const confirm = window.confirm(`Remove ${followerUsername} from followers?`)
    if (!confirm) return

    try {
      // 🔥 remove follower from backend
      await api.post(`/api/users/remove-follower/${followerUsername}`)

      // 🔥 update UI instantly
      setFollowers((prev) =>
        prev.filter((f) => f.follower !== followerUsername),
      )

      toast.info(`${followerUsername} removed`)
    } catch (err) {
      console.error(err)

      toast.error(err.response?.data?.message || "Failed to remove follower")
    }
  }

  const handleRequestAction = async (requestId, status) => {
    try {
      // find username before removing request
      const request = requests.find((r) => r._id === requestId)
      const requester = request?.follower

      // update on server
      await api.patch(`/api/users/follow/request/${requestId}`, { status })

      // remove request instantly
      setRequests((prev) => prev.filter((r) => r._id !== requestId))

      if (status === "accepted") {
        // add follower instantly
        setFollowers((prev) => [...prev, { follower: requester }])

        toast.success(`${requester} is now following you`)
      } else {
        toast.info(`Request from ${requester} rejected`)
      }
    } catch (err) {
      console.error(err)

      toast.error(err.response?.data?.message || "Failed to update request")
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

      <div className="profile-tabs">
        <button
          className={!showSaved ? "active" : ""}
          onClick={() => setShowSaved(false)}
        >
          Posts
        </button>

        {isOwnProfile && (
          <button
            className={showSaved ? "active" : ""}
            onClick={() => setShowSaved(true)}
          >
            Saved
          </button>
        )}
      </div>

      {/* POSTS GRID */}
      <div className="posts-grid">
        {/* USER POSTS */}
        {!showSaved &&
          posts.map((post) => (
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

        {/* SAVED POSTS */}
        {showSaved &&
          savedPosts.length > 0 &&
          savedPosts.map((post) => (
            <div key={post._id} className="post-item">
              <img src={post.imgUrl} alt="" />

              <button className="unsave" onClick={() => toggleSave(post._id)}>
                Unsave
              </button>
            </div>
          ))}
      </div>

      {/* ⭐ EMPTY STATE */}
      {showSaved && savedPosts.length === 0 && (
        <div className="empty-state">
          <i className="fa-regular fa-bookmark"></i>
          <h3>No Saved Posts</h3>
          <p>Save posts to view them here later.</p>
        </div>
      )}
    </div>
  )
}

export default UserProfile
