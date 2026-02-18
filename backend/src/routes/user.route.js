const express = require('express')
const identifyUser = require('../middlewares/auth.middleware')
const userController = require('../controllers/user.controller')

const userRouter = express.Router()

/**
* @route POST api/users/follow/:userId
* @description Follow a user
* @access Private 
*/
userRouter.post('/follow/:userId', identifyUser, userController.followUserController)

/**
* @route POST api/users/unfollow/:userId
* @description Unfollow a user
* @access Private 
*/
userRouter.post('/unfollow/:userId', identifyUser, userController.unfollowUserController)


module.exports = userRouter