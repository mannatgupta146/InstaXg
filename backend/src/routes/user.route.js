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
 * @route   PATCH /api/users/follow/request/:requestId
 * @desc    Accept or reject follow request by sending res
 * @access  Private
 */
userRouter.patch(
  "/follow/request/:requestId",
  identifyUser,
  userController.updateFollowRequestController,
)

/**
 * @route   GET /api/users/followers
 * @desc    Get all followers of logged-in user
 * @access  Private
 */
userRouter.get(
  "/followers",
  identifyUser,
  userController.getFollowersController,
)

/**
 * @route   GET /api/users/following
 * @desc    Get users followed by logged-in user
 * @access  Private
 */
userRouter.get(
  "/following",
  identifyUser,
  userController.getFollowingController,
)

/**
 * @route   GET /api/users/profile
 * @desc    Get logged in user profile
 * @access  Private
 */
userRouter.get("/profile", identifyUser, userController.getProfileController)

/**
 * @route   PATCH /api/users/profile
 * @desc    Update logged in user profile
 * @access  Private
 */
userRouter.patch(
  "/profile",
  identifyUser,
  userController.updateProfileController,
)

module.exports = userRouter
