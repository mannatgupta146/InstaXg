const express = require("express")
const identifyUser = require("../middlewares/auth.middleware")
const userController = require("../controllers/user.controller")

const userRouter = express.Router()

/**
 * @route POST api/users/follow/:username
 * @description Follow a user
 * @access Private
 */
userRouter.post(
  "/follow/:username",
  identifyUser,
  userController.followUserController,
)

/**
 * @route POST api/users/unfollow/:username
 * @description Unfollow a user
 * @access Private
 */
userRouter.post(
  "/unfollow/:username",
  identifyUser,
  userController.unfollowUserController,
)

module.exports = userRouter
