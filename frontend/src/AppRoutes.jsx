import { createBrowserRouter } from "react-router-dom";
import Register from "./features/auth/pages/Register";
import Login from "./features/auth/pages/Login";
import Feed from "./features/post/pages/Feed";

export const router = createBrowserRouter([
  {
    path: '/register',
    element: <Register />
  },
  
  {
    path: '/login',
    element: <Login />
  },

  {
    path: '/',
    element: <Feed />
  }
])