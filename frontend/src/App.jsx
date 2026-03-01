import React from 'react'
import { router } from "./AppRoutes.jsx";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from './features/auth/context/auth.context.jsx'
import { PostProvider } from './features/post/context/post.context.jsx'

// ⭐ IMPORT
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <AuthProvider>
      <PostProvider>
        <RouterProvider router={router} />

        {/* ⭐ GLOBAL TOAST */}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
      </PostProvider>
    </AuthProvider>
  )
}

export default App