import { useContext } from "react"
import { PostContext } from "../context/post.context"
import { getFeed } from "../services/post.api.js"

export const usePost = () => {
    const context = useContext(PostContext)

    if (!context) {
        throw new Error("usePost must be used inside PostProvider")
    }

    const { post, setPost, feed, setFeed, loading, setLoading } = context

const handleGetFeed = async () => {
    setLoading(true)
    try {
        const data = await getFeed()

        console.log("🔥 FEED DATA:", data)
        console.log("🔥 POSTS:", data.posts)

        if (data?.posts) {
            setFeed(data.posts)
        } else {
            setFeed([])
        }

    } catch (error) {
        console.error("Feed fetch error:", error)
        setFeed([])   // 🔥 prevent stale data
    } finally {
        setLoading(false)
    }
}

    return {post, setPost, feed, setFeed, loading, setLoading, handleGetFeed}
}