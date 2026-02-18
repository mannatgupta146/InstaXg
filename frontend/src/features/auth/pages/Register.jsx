import React from "react"

const Register = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>

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
      </form>
    </main>
  )
}

export default Register
