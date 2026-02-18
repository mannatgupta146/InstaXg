import React from "react"
import { useState } from 'react'
import '../style/form.scss'
import { Link } from "react-router-dom"

const Register = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
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

        <button>Login</button>

        <p>Already have an account? <Link className="toggleAuth" to='/login'>Login</Link></p>
      </form>
    </main>
  )
}

export default Register
