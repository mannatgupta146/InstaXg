const followModel = require("../models/follow.model")
const userModel = require("../models/user.model")


const followUserController = async(req, res) => {
    
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    const followRecord = await followModel.create({
        follower: followerUsername,
        followee: followeeUsername
    })

    res.status(201).json({
        message:  `You are following ${followerUsername}`,
        follow: followRecord
    })
}

const unfollowUserController = async(req, res) => {
    
}

module.exports = {
    followUserController,
    unfollowUserController
}