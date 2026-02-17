const mongoose = require('mongoose')

const followSchema = mongoose.Schema({
    follower: {
        ref: "users",
        type: mongoose.Schema.Types.ObjectId,
        required: [ true, "Follower is required" ] 
    },
    followee: {
        ref: "users",
        type: mongoose.Schema.Types.ObjectId,
        required: [ true, "Follower is required" ] 
    },
},{timestamps: true})

const followModel = mongoose.model('follows', followSchema)

module.exports = followModel