const followModel = require("../models/follow.model")
const postModel = require("../models/post.model")
const userModel = require("../models/user.model")
const likeModel = require("../models/like.model")
const ImageKit = require("@imagekit/nodejs")

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

const createPostController = async (req, res) => {
  console.log("USER FROM TOKEN:", req.user)

  const file = await imagekit.files.upload({
    file: await ImageKit.toFile(Buffer.from(req.file.buffer), "file"),
    fileName: "Test",
    folder: "instaxg/images",
  })

  const post = await postModel.create({
    caption: req.body.caption,
    username: req.user.username,
    user: req.user.id,
    imgUrl: file.url,
  })

  res.status(201).json({
    message: "post created successfully",
    post,
  })
}

const getPostController = async (req, res) => {
  const userId = req.user.id

  const posts = await postModel.find({ user: userId })

  if (!posts) {
    return res.status(404).json({
      message: "Posts not found",
    })
  }

  res.status(200).json({
    message: "posts fetched successfully",
    posts,
  })
}

const getPostDetailsController = async (req, res) => {
  const userId = req.user.id
  const username = req.user.username
  const postId = req.params.postId

  const post = await postModel.findById(postId)

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    })
  }

  // owner check
  if (post.user.toString() === userId) {
    return res.status(200).json({
      message: "post details fetched",
      post,
    })
  }

  // check if follower is accepted
  const followRelation = await followModel.findOne({
    follower: username,
    followee: post.username, // or owner's username
    status: "accepted",
  })

  if (!followRelation) {
    return res.status(403).json({
      message: "Follow user to view posts",
    })
  }

  res.status(200).json({
    message: "post details fetched",
    post,
  })
}

const postLikeController = async (req, res) => {
  const username = req.user.username
  const postId = req.params.postId

  const post = await postModel.findById(postId)

  if (!post) {
    return res.status(404).json({
      message: "No post exists",
    })
  }

  // allow owner
  if (post.username !== username) {
    const relation = await followModel.findOne({
      follower: username,
      followee: post.username,
      status: "accepted",
    })

    if (!relation) {
      return res.status(403).json({
        message: "Follow user to like posts",
      })
    }
  }

  const like = await likeModel.create({
    user: username,
    post: postId,
  })

  res.status(200).json({
    message: "post liked successfully",
    like,
  })
}

const getFeedController = async (req, res) => {
  const username = req.user.username
  const userId = req.user.id

  // find accepted following usernames
  const following = await followModel
    .find({ follower: username, status: "accepted" })
    .select("followee")

  const followingUsernames = following.map((f) => f.followee)

  // resolve followee user ids (handles posts that were created without username field)
  const followeeUsers = await userModel
    .find({ username: { $in: followingUsernames } })
    .select("_id username profilePic")

  const userIds = followeeUsers.map((u) => u._id.toString())
  userIds.push(userId)

  // get posts by user ObjectId (safer for existing data)
  const posts = await postModel
    .find({ user: { $in: userIds } })
    .sort({ createdAt: -1 })

  // build a quick map for profile pics
  const profilePicMap = {}
  followeeUsers.forEach((u) => {
    profilePicMap[u.username] = u.profilePic || null
    profilePicMap[u._id.toString()] = u.profilePic || null
  })

  const loggedInUser = await userModel
    .findById(userId)
    .select("username profilePic")
  if (loggedInUser) {
    profilePicMap[loggedInUser.username] = loggedInUser.profilePic || null
    profilePicMap[loggedInUser._id.toString()] = loggedInUser.profilePic || null
  }

  const postsWithUserData = posts.map((post) => {
    const pObj = post.toObject()
    // prefer username lookup, fallback to user id
    let pic = null
    if (pObj.username && profilePicMap[pObj.username] !== undefined)
      pic = profilePicMap[pObj.username]
    if (!pic && pObj.user) pic = profilePicMap[pObj.user.toString()] || null
    return { ...pObj, profilePic: pic }
  })

  res.status(200).json({ posts: postsWithUserData })
}

const getUserPostsController = async (req, res) => {
  const username = req.params.username

  const posts = await postModel.find({ username }).sort({ createdAt: -1 })

  const user = await userModel.findOne({ username }, "profilePic")

  const postsWithPic = posts.map((post) => ({
    ...post.toObject(),
    profilePic: user?.profilePic || null,
  }))

  res.json({ posts: postsWithPic })
}

const deletePostController = async (req, res) => {
  try {
    const postId = req.params.postId

    const post = await postModel.findById(postId)
    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    // only owner can delete
    if (post.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" })
    }

    await postModel.findByIdAndDelete(postId)

    // remove associated likes
    await likeModel.deleteMany({ post: postId })

    res.status(200).json({ message: "Post deleted successfully" })
  } catch (err) {
    console.error("Error deleting post:", err)
    res.status(500).json({ message: "Error deleting post" })
  }
}

module.exports = {
  createPostController,
  getPostController,
  getPostDetailsController,
  postLikeController,
  getFeedController,
  getUserPostsController,
  deletePostController,
}
