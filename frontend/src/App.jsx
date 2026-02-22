import React from 'react'
import { router } from "./AppRoutes.jsx";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from './features/auth/context/auth.context'

const App = () => {
  return (
    <div>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  )
}

export default App
