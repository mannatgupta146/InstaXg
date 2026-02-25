import { useContext } from "react"
import { PostContext } from "../context/post.context"
import { getFeed } from "../services/post.api.js"

export const usePost = () => {

    const context = useContext(PostContext)

    const {post, setPost, feed, setFeed, loading, setLoading} = context

    const handleGetFeed = async () => {
        setLoading(true)
        try {
            const data = await getFeed()
            setFeed(data.posts)
            
        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
    }

    return {post, setPost, feed, setFeed, loading, setLoading, handleGetFeed}
}