import axios from 'axios'

const api = axios.create( {
    baseURL: 'http://localhost:3000/api/auth',
    withCredentials: true
})

export const register = async(username, email, password) => {
  try {
    api
      .post(
        "/register",
        {
          username,
          email,
          password,
        }
      )

      .then((res) => {
        console.log(res.data)
      })

  } catch (error) {}
}

export const login = async(username, password) => {
  try {
    api
      .post(
        "/login",
        {
          username,
          password,
        }
      )

      .then((res) => {
        console.log(res.data)
      })
  } catch (error) {}
}

export const getMe = async(username, password) => {

  try {
    
    const response = await api.get('/get-me')
    return response.data
    
  } catch (error) {
    
  }
}