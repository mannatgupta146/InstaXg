const followModel = require("../models/follow.model")
const userModel = require("../models/user.model")

const followUserController = async (req, res) => {

  const followerUsername = req.user.username
  const followeeUsername = req.params.username

  // ❌ cannot follow yourself
  if (followeeUsername === followerUsername) {
    return res.status(400).json({
      message: "You can't follow yourself"
    })
  }

  // ❌ check if user exists
  const isFolloweeExists = await userModel.findOne({
    username: followeeUsername
  })

  if (!isFolloweeExists) {
    return res.status(404).json({
      message: `${followeeUsername} doesn't exist`
    })
  }

  // 🔍 check existing relationship
  const existingFollow = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername
  })

  if (existingFollow) {

    // already accepted → already following
    if (existingFollow.status === "accepted") {
      return res.status(409).json({
        message: `You are already following ${followeeUsername}`
      })
    }

    // pending → request already sent
    if (existingFollow.status === "pending") {
      return res.status(409).json({
        message: "Follow request already sent"
      })
    }

    // rejected → allow re-request (update to pending)
    existingFollow.status = "pending"
    await existingFollow.save()

    return res.status(200).json({
      message: "Follow request sent again"
    })
  }

  // ✅ create new request
  const followRecord = await followModel.create({
    follower: followerUsername,
    followee: followeeUsername,
    status: "pending"
  })

  res.status(200).json({
    message: `Follow request sent to ${followeeUsername}`,
    follow: followRecord
  })
}

const unfollowUserController = async (req, res) => {

  const followerUsername = req.user.username
  const followeeUsername = req.params.username

  const existingFollow = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername
  })

  if (!existingFollow) {
    return res.status(409).json({
      message: `You are not following ${followeeUsername}`
    })
  }

  // if request pending → cancel request
  if (existingFollow.status === "pending") {
    await followModel.findByIdAndDelete(existingFollow._id)

    return res.status(200).json({
      message: "Follow request cancelled"
    })
  }

  // if accepted → unfollow
  if (existingFollow.status === "accepted") {
    await followModel.findByIdAndDelete(existingFollow._id)

    return res.status(200).json({
      message: `Successfully unfollowed ${followeeUsername}`
    })
  }

  // if rejected
  return res.status(409).json({
    message: "No active relationship"
  })
}


const getFollowRequestsController = async(req, res) => {

    const loggedinUser = req.user.username
    
    const requests = await followModel.find({
        followee: loggedinUser,
        status: 'pending'
    }).select("follower createdAt status -_id")


    res.status(200).json({
        message: "All follow requests fetched",
        requests
    })

}

const updateFollowRequestController = async (req, res) => {
    
    const loggedInUser = req.user.username
    const requestId = req.params.requestId
    const { status } = req.body

    // validate status
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status"
      })
    }

    const request = await followModel.findById(requestId)

    if (!request) {
      return res.status(404).json({
        message: "Request not found"
      })
    }

    // security check
    if (request.followee !== loggedInUser) {
      return res.status(403).json({
        message: "Unauthorized action"
      })
    }

    // prevent duplicate update
    if (request.status === status) {
      return res.status(400).json({
        message: `Request already ${status}`
      })
    }

    // update status
    request.status = status
    await request.save()

    res.status(200).json({
      message:
        status === "accepted"
          ? `${request.follower} is now your follower`
          : "Follow request rejected"
    })
}


module.exports = {
    followUserController,
    unfollowUserController,
    getFollowRequestsController,
    updateFollowRequestController
}