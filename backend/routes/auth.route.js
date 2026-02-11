const express = require('express')
const userModel = require('../models/user.model')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const authRouter = express.Router()

authRouter.post('/register', async(req, res) => {
    const {name, username, email, password, bio, profilePic} = req.body

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            {username},
            {email}
        ]
    })

    if(isUserAlreadyExists){
        return res.status(409).json({
            message: "User already exists" + (isUserAlreadyExists.email == email ? 'User email already exists' : 'Username already exists')
        })
    }

    const hash = crypto.createHash('sha256').update(password).digest('hex')

    const user = await userModel.create({name, username, email, password: hash, bio, profilePic})

    const token = jwt.sign(
        {id: user._id},
        process.env.JWT_SECRET,
        {expiresIn: '1d'}
    )

    res.cookie('jwt_token', token)

    res.status(201).json({
        message: "User registered successfully",
        user: {
            name: user.name,
            username: user.username,
            email: user.email,
            bio: user.bio,
            profilePic: user.profilePic
        }
    })
})

authRouter.post('/login', async(req, res) => {
    const {name, username, email, password, bio, profilePic} = req.body

    const user = await userModel.findOne({
        $or: [
            {username: username},
            {email: email}
        ]
    })

    if(!user){
        return res.status(404).json({
            message: "User not found"
        })
    }

    const hash = crypto.createHash('sha256').update(password).digest('hex')

    const isPasswordMatched = hash == user.password

    if(!isPasswordMatched){
        return res.status(401).json({
            message: "incoorect or invalid password"
        })
    }

    const token = jwt.sign(
        {id: user._id},
        process.env.JWT_SECRET,
        {expiresIn: '1d'}
    )

    res.cookie('jwt_token', token)

    res.status(200).json({
        message: "User loggedin successfully",
        user: {
            name: user.name,
            username: user.username,
            email: user.email,
            bio: user.bio,
            profilePic: user.profilePic
        }
    })
})

module.exports = authRouter