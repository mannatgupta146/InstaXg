const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registerController = async(req, res) => {
    const {name, username, email, password, bio, profilePic} = req.body

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            {email},
            {username}
        ]
    })

    if(isUserAlreadyExists){
        return res.status(409).json({
            message: "user already exists"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({name, username, email, password: hash, bio, profilePic})

    const token = jwt.sign(
        {id: user.id},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )

    res.cookie("jwt_token", token)

    res.status(201).json({
        message: "user registered successfully",
        user: {
            name: user.name, 
            username: user.username, 
            email: user.email, 
            bio: user.bio, 
            profilePic: user.profilePic
        }
    })
}

const loginController = async(req, res) => {
    const {name, username, email, password, bio, profilePic} = req.body

    const user = await userModel.findOne({
        $or: [
            {username: username},
            {email: email}
        ]
    })

    if(!user){
        return res.status(404).json({
            message: "user not found"
        })
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password)

    if(!isPasswordMatched){
        return res.status(401).json({
            message: "invalid password"
        })
    }

    const token = jwt.sign(
        {id: user.id},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )

    res.cookie("jwt_token", token)

    res.status(200).json({
        message: "user loggedin successfully",
        user: {
            name: user.name, 
            username: user.username, 
            email: user.email, 
            bio: user.bio, 
            profilePic: user.profilePic
        }
    })
}

module.exports = {
    registerController,
    loginController
}