import React from 'react'
import { useState } from 'react'
import '../style/form.scss'

const Login = () => {

    

  return (
    <main>
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>

            <input onChange={(e) => {setUsername(e.target.value)}}
            type="text" 
            placeholder='Enter username'
            value = {username}
            />
            
            <input onChange={(e) => {setPassword(e.target.value)}}
            type="password" 
            placeholder='Enter password' 
            value = {password}
            />

            <button>Login</button>
        </form>
    </main>
  )
}

export default Login