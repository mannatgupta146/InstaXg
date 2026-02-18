const express = require('express')
const cookieParser = require('cookie-parser')


const app = express()

app.use(express.json())
app.use(cookieParser())

// require routes
const authRouter = require('../src/routes/auth.route')
const postRouter = require('../src/routes/post.routes')
const userRouter = require('./routes/user.route')

// using routes
app.use('/api/auth', authRouter)
app.use('/api/posts', postRouter)
app.use('/api/users', userRouter)

module.exports = app