import React from "react"
import { useState } from "react"
import "../style/form.scss"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const Register = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { loading, handleRegister } = useAuth()

  const navigate = useNavigate()

  if (loading) {
    return <h1>Loading...</h1>
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await handleRegister(username, email, password)

    console.log(res)
    console.log(res.user)

    navigate("/")
  }

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <h1>Register User</h1>

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
            setEmail(e.target.value)
          }}
          type="text"
          placeholder="Enter email"
          value={email}
        />

        <input
          onChange={(e) => {
            setPassword(e.target.value)
          }}
          type="password"
          placeholder="Enter password"
          value={password}
        />

        <button>Register</button>

        <p>
          Already have an account?{" "}
          <Link className="toggleAuth" to="/login">
            Login
          </Link>
        </p>
      </form>
    </main>
  )
}

export default Register
