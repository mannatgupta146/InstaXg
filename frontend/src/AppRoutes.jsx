import { createBrowserRouter } from "react-router-dom"
import Register from "./features/auth/pages/Register"
import Login from "./features/auth/pages/Login"
import Feed from "./features/post/pages/Feed"
import CreatePost from "./features/post/pages/CreatePost"
import UserProfile from "./features/post/pages/UserProfile"

export const router = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/",
    element: <Feed />,
  },

  {
    path: "/create",
    element: <CreatePost />,
  },

  {
    path: "/profile",
    element: <UserProfile />,
  },
])
