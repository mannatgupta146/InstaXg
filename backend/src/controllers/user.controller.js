const followModel = require("../models/follow.model")
const userModel = require("../models/user.model")

const followUserController = async(req, res) => {
    
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    if(followeeUsername === followerUsername){
        return res.status(400).json({
            message: "You can't follow yourself"
        })
    }

    const isFolloweeExists = await userModel.findOne({
        username: followeeUsername
    })

    if(!isFolloweeExists){
        return res.status(404).json({
            message: `${followeeUsername} doesn't exists`
        })
    }

    const isAlreadyFollowing = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })

    if(isAlreadyFollowing){
        return res.status(409).json({
            message: `You are already following ${followeeUsername}`
        })
    }

    const followRecord = await followModel.create({
        follower: followerUsername,
        followee: followeeUsername
    })

    res.status(201).json({
        message:  `You are following ${followeeUsername}`,
        follow: followRecord
    })
}

const unfollowUserController = async(req, res) => {
    
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    const isUserFollowing = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })

    if(!isUserFollowing){
        return res.status(409).json({
            message: `You are not following ${followeeUsername}`
        })
    }

    await followModel.findByIdAndDelete(isUserFollowing._id)

    res.status(200).json({
        message: `Successfully unfollowed ${followeeUsername}`
    })

}

module.exports = {
    followUserController,
    unfollowUserController
}