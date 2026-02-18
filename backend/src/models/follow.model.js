const mongoose = require('mongoose')

const followSchema = mongoose.Schema({
    follower: {
        type: String,
        required: [ true, "Follower is required" ] 
    },
    followee: {
        type: String,
        required: [ true, "Follower is required" ] 
    },
},{timestamps: true})

const followModel = mongoose.model('follows', followSchema)

module.exports = followModel