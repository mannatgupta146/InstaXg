import React from "react"
import { useState } from "react"
import "../style/form.scss"
import { Link } from "react-router-dom"
import axios from 'axios'

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    axios
      .post(
        "http://localhost:3000/api/auth/login",
        {
          username,
          password,
        },
        { withCredentials: true },
      )

      .then((res) => {
        console.log(res.data)
      })
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
