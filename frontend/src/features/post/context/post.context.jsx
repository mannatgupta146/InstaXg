import { createContext, useState } from "react";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {

    const [post, setPost] = useState(null)
    const [feed, setFeed] = useState(null)
    const [loading, setLoading] = useState(false)

    return (
        <PostContext.Provider value={{post, setPost, feed, setFeed, loading, setLoading}}>   
            {children}
        </PostContext.Provider>
    )
}