import React, { useEffect } from "react"
import "../style/feed.scss"
import { usePost } from "../hooks/usePost"

const Feed = () => {

  const {feed, handleGetFeed, loading} = usePost()

  useEffect(() => {
    handleGetFeed()
  },[])

  if(loading || !feed) {
    return <div>Loading...</div>
  }
  return (
    <main className="feed-container">
      <div className="feed">
        
      </div>
    </main>
  )
}

export default Feed
