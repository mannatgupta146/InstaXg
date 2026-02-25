const express = require("express")
const postContoller = require("../controllers/post.controller")

const multer = require("multer")
const identifyUser = require("../middlewares/auth.middleware")
const upload = multer({ storage: multer.memoryStorage() })

const postRouter = express.Router()

/**
 * @route   POST /api/posts
 * @desc    Create a new post (with image upload)
 * @access  Private (Authenticated users only)
 */
postRouter.post(
  "/",
  upload.single("image"),
  identifyUser,
  postContoller.createPostController,
)

/**
 * @route   GET /api/posts
 * @desc    Get all posts (feed)
 * @access  Private (Authenticated users only)
 */
postRouter.get("/", identifyUser, postContoller.getPostController)

/**
 * @route   GET /api/posts/details/:postId
 * @desc    Get details of a specific post
 * @access  Private (Authenticated users only)
 */
postRouter.get(
  "/details/:postId",
  identifyUser,
  postContoller.getPostDetailsController,
)

/**
 * @route   POST /api/posts/like/:postId
 * @desc    Like or unlike a post
 * @access  Private (Authenticated users only)
 */
postRouter.post("/like/:postId", identifyUser, postContoller.postLikeController)

/**
 * @route   GET /api/posts/feed
 * @desc    Get all the posts 
 * @access  Private (Authenticated users only)
 */
postRouter.get("/feed", identifyUser, postContoller.getFeedController)

module.exports = postRouter
