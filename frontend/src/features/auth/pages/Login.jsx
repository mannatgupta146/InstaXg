import React from "react"
import { useState } from "react"
import "../style/form.scss"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const { handleLogin, loading } = useAuth()

  if(loading){
    return (
      <h1>Loading...</h1>
    )
  }

  const handleSubmit = async(e) => {
    e.preventDefault()

    const res = await handleLogin(username, password)

    console.log(res);
    console.log(res.user);

    navigate('/')
  }

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <h1>Login User</h1>

        <input
          onChange={(e) => {
            setUsername(e.target.value)
          }}
          type="text"
          placeholder="Enter username"
          value={username}
        />

        <input
          onChange={(e) => {
            setPassword(e.target.value)
          }}
          type="password"
          placeholder="Enter password"
          value={password}
        />

        <button>Login</button>

        <p>
          Don't have an account?{" "}
          <Link className="toggleAuth" to="/register">
            Register
          </Link>
        </p>
      </form>
    </main>
  )
}

export default Login
