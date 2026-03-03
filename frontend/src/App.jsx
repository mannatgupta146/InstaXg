import React from "react";
import { router } from "./AppRoutes.jsx";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./features/auth/context/auth.context.jsx";
import { PostProvider } from "./features/post/context/post.context.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppContent = () => {
  const { loading } = useContext(AuthContext);

  // 🔥 Wait for auth check before rendering router
  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "200px" }}>Loading...</div>;
  }
}

const App = () => {
  return (
    <AuthProvider>
      <PostProvider>
        <RouterProvider router={router} />

        <ToastContainer
          position="top-right"
          autoClose={2000}
          newestOnTop
          pauseOnHover
          theme="colored"
        />
      </PostProvider>
    </AuthProvider>
  );
};

export default App;