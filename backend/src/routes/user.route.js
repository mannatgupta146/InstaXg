const express = require("express")
const identifyUser = require("../middlewares/auth.middleware")
const userController = require("../controllers/user.controller")

const userRouter = express.Router()

/**
 * @route   POST /api/users/follow/:username
 * @desc    Send follow request to a user
 * @access  Private
 */
userRouter.post(
  "/follow/:username",
  identifyUser,
  userController.followUserController,
)

/**
 * @route   POST /api/users/unfollow/:username
 * @desc    Unfollow a user
 * @access  Private
 */
userRouter.post(
  "/unfollow/:username",
  identifyUser,
  userController.unfollowUserController,
)

/**
 * @route   GET /api/users/follow/requests
 * @desc    Get pending follow requests for logged-in user
 * @access  Private
 */
userRouter.get(
  "/follow/requests",
  identifyUser,
  userController.getFollowRequestsController,
)

/**
 * @route   POST /api/users/follow/accept/:requestId
 * @desc    Accept a follow request
 * @access  Private
 */
userRouter.post(
  "/follow/accept/:requestId",
  identifyUser,
  userController.acceptFollowRequestController,
)

/**
 * @route   POST /api/users/follow/reject/:requestId
 * @desc    Reject a follow request
 * @access  Private
 */
userRouter.post(
  "/follow/reject/:requestId",
  identifyUser,
  userController.rejectFollowRequestController,
)

module.exports = userRouter
