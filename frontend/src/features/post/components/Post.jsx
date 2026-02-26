import React, { useState, useContext } from "react"
import axios from "axios"
import { AuthContext } from "../../auth/context/auth.context"
import "../style/feed.scss"

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
})

const Post = ({ post }) => {
  const { user: currentUser } = useContext(AuthContext)
  const [liked, setLiked] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

const profilePic =
  post.profilePic ||
  currentUser?.profilePic ||
  "https://i.pravatar.cc/150?img=65";
  const defaultProfilePic = currentUser?.profilePic
  const isOwnPost = currentUser?.username === post?.username

  const handleLike = () => {
    setLiked(!liked)
  }

  const handleFollow = async () => {
    setFollowLoading(true)
    try {
      if (isFollowing) {
        await api.post(`/api/users/unfollow/${post.username}`)
        setIsFollowing(false)
        console.log("Unfollowed:", post.username)
      } else {
        await api.post(`/api/users/follow/${post.username}`)
        setIsFollowing(true)
        console.log("Followed:", post.username)
      }
    } catch (err) {
      console.error("Follow error:", err)
      alert(err.response?.data?.message || "Error toggling follow")
    } finally {
      setFollowLoading(false)
    }
  }

  return (
    <div className="post-card">
      {/* HEADER */}
      <div className="post-header">
        <div className="user-info">
          <div className="img-wrapper">
            <div className="inner-circle">
              {!imageError && profilePic ? (
                <img
                  src={profilePic}
                  alt={post.username}
                  onError={() => setImageError(true)}
                />
              ) : (
                <img src={defaultProfilePic} alt="default" />
              )}
            </div>
          </div>
          <span>{post.username}</span>
        </div>

        {!isOwnPost && (
          <button
            className={`action-btn ${isFollowing ? "following" : "follow"}`}
            onClick={handleFollow}
            disabled={followLoading}
          >
            {followLoading ? "..." : isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>

      {/* POST IMAGE */}
      <div className="post-image">
        <img src={post.imgUrl} alt={post.caption || "post"} />
      </div>

      {/* ACTIONS */}
      <div className="post-actions">
        <div className="left-icons">
          <i
            className={`fa-${liked ? "solid" : "regular"} fa-heart`}
            onClick={handleLike}
            style={{ color: liked ? "#e74c3c" : "inherit", cursor: "pointer" }}
          ></i>
          <i className="fa-regular fa-comment"></i>
          <i className="fa-regular fa-paper-plane"></i>
        </div>

        <div className="right-icon">
          <i className="fa-regular fa-bookmark"></i>
        </div>
      </div>

      {/* CAPTION */}
      <div className="post-caption">
        <strong>{post.username}</strong> {post.caption}
      </div>
    </div>
  )
}

export default Post
