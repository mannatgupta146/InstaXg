import { useContext } from "react"
import { AuthContext } from "../context/auth.context"
import { getMe, login, register } from "../services/auth.api"

export const useAuth = () => {
  const context = useContext(AuthContext)

  const { user, setUser, loading, setLoading } = context

  const handleRegister = async (username, email, password) => {
    setLoading(true)

    try {
      const response = await register(username, email, password)
      
      setUser(response.user)
      return response

    } catch (error) {
      console.log(error)

    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (username, password) => {
    setLoading(true)

    try {
      const response = await login(username, password)

      setUser(response.user)
      return response

    } catch (error) {
      console.log(error)

    } finally {
      setLoading(false)
    }
  }

  return {
    user, loading, handleLogin, handleRegister
  }
}
