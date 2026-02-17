const express = require("express")
const postContoller = require("../controllers/post.controller")

const multer = require("multer")
const identifyUser = require("../middlewares/auth.middleware")
const upload = multer({ storage: multer.memoryStorage() })

const postRouter = express.Router()

postRouter.post(
  "/",
  upload.single("image"),
  identifyUser,
  postContoller.createPostController,
)
postRouter.get("/", identifyUser, postContoller.getPostController)
postRouter.get(
  "/details/:postId",
  identifyUser,
  postContoller.getPostDetailsController,
)

module.exports = postRouter
