const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
    },
    username: {
        type: String,
        required: [true, "username is required"],
        unique: [true, "user already exista"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "email already exista"]
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: 'https://ik.imagekit.io/mannatgupta146/56af7ed2c15a58fed21e8ffd0744bb1e.jpg'
    },
    bio: {
        type: String
    }
})

const userModel = mongoose.model('users', userSchema)

module.exports = userModel