const express = require("express")
const identifyUser = require("../middlewares/auth.middleware")
const userController = require("../controllers/user.controller")

const userRouter = express.Router()

/**
 * @route   POST /api/users/follow/:username
 * @desc    Follow a user
 * @access  Private (Authenticated users only)
 */
userRouter.post(
  "/follow/:username",
  identifyUser,
  userController.followUserController,
)

/**
 * @route   POST /api/users/unfollow/:username
 * @desc    Unfollow a user
 * @access  Private (Authenticated users only)
 */
userRouter.post(
  "/unfollow/:username",
  identifyUser,
  userController.unfollowUserController,
)

module.exports = userRouter