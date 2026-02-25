import React from 'react'
import { router } from "./AppRoutes.jsx";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from './features/auth/context/auth.context.jsx'
import { PostProvider } from './features/post/context/post.context.jsx';

const App = () => {
  return (
    <div>
      <AuthProvider>
        <PostProvider>
          <RouterProvider router={router} />
        </PostProvider>
      </AuthProvider>
    </div>
  )
}

export default App
