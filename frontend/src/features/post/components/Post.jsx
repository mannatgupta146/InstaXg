import React, { useState, useContext, useEffect } from "react"
import axios from "axios"
import { AuthContext } from "../../auth/context/auth.context"
import { toast } from "react-toastify"
import "../style/feed.scss"

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
})

const Post = ({ post }) => {
  const { user: currentUser } = useContext(AuthContext)

  const [imageError, setImageError] = useState(false)
  const [isFollowing, setIsFollowing] = useState(post.isFollowing)
  const [followLoading, setFollowLoading] = useState(false)
  const [likeLoading, setLikeLoading] = useState(false)

  const [liked, setLiked] = useState(post.likedByCurrentUser)
  const [likesCount, setLikesCount] = useState(post.likesCount)

  const isOwnPost = currentUser?.username === post?.username

  const profilePic =
    post.profilePic ||
    currentUser?.profilePic ||
    "https://i.pravatar.cc/150?img=65"

  const defaultProfilePic = currentUser?.profilePic

  // ✅ LIKE / UNLIKE
  const handleLike = async () => {
    if (likeLoading) return
    setLikeLoading(true)

    try {
      const res = await api.post(`/api/posts/like/${post._id}`)

      setLiked(res.data.liked)
      setLikesCount(res.data.likesCount)

      toast.success(res.data.liked ? "❤️ Liked" : "💔 Unliked")
    } catch (err) {
      console.error(err)
      toast.error("Failed to update like")
    } finally {
      setLikeLoading(false)
    }
  }

  // ✅ FOLLOW / UNFOLLOW
  const handleFollow = async () => {
    if (followLoading) return
    setFollowLoading(true)

    try {
      if (isFollowing) {
        await api.post(`/api/users/unfollow/${post.username}`)
        setIsFollowing(false)
        toast.info(`Unfollowed ${post.username}`)
      } else {
        await api.post(`/api/users/follow/${post.username}`)
        setIsFollowing(true)
        toast.success("Follow request sent")
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "Action failed")
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

        {!isOwnPost && !isFollowing &&  (
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
            style={{
              color: liked ? "#e74c3c" : "inherit",
              cursor: likeLoading ? "wait" : "pointer",
              transition: "0.2s",
            }}
          ></i>

          <i className="fa-regular fa-comment"></i>
          <i className="fa-regular fa-paper-plane"></i>
        </div>

        <div className="right-icon">
          <i className="fa-regular fa-bookmark"></i>
        </div>
      </div>

      {/* ❤️ Likes Count */}
      <div className="likes-count">
        {likesCount > 0 && <span>{likesCount} likes</span>}
      </div>

      {/* CAPTION */}
      <div className="post-caption">
        <strong>{post.username}</strong> {post.caption}
      </div>
    </div>
  )
}

export default Post