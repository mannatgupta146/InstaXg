import React, { useEffect, useState } from "react"
import "../style/search.scss"
import { getUsers, followUser, unfollowUser } from "../services/user.api"

const Search = () => {
  const [users, setUsers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [query, setQuery] = useState("")

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    const data = await getUsers()
    setUsers(data)
    setFiltered(data)
  }

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase()
    setQuery(value)

    const filteredUsers = users.filter((u) =>
      u.username.toLowerCase().includes(value),
    )

    setFiltered(filteredUsers)
  }

  const updateStatus = (username, newStatus) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.username === username ? { ...u, followStatus: newStatus } : u,
      ),
    )

    setFiltered((prev) =>
      prev.map((u) =>
        u.username === username ? { ...u, followStatus: newStatus } : u,
      ),
    )
  }

  const toggleFollow = async (username, status) => {
    try {
      // 🔥 if following → unfollow
      if (status === "accepted") {
        await unfollowUser(username)

        // instant UI update
        updateStatus(username, null)
        return
      }

      // 🔥 if request pending → cancel request
      if (status === "pending") {
        await unfollowUser(username)

        updateStatus(username, null)
        return
      }

      // 🔥 send follow request
      await followUser(username)

      updateStatus(username, "pending")
    } catch (err) {
      console.error("Follow error:", err)
    }
  }

  return (
    <div className="search-page">
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={handleSearch}
        className="search-input"
      />

      <div className="user-list">
        {filtered.map((user) => (
          <div className="user-card" key={user.username}>
            <div className="user-info">
              <img src={user.profilePic || "/avatar.png"} alt="" />
              <span>{user.username}</span>
            </div>

            <button
              className={`follow-btn ${
                user.followStatus === "accepted" ? "following" : ""
              }`}
              onClick={() => toggleFollow(user.username, user.followStatus)}
            >
              {user.followStatus === "accepted"
                ? "Following"
                : user.followStatus === "pending"
                  ? "Requested"
                  : "Follow"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Search
