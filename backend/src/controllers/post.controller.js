const followModel = require("../models/follow.model")
const postModel = require("../models/post.model")
const ImageKit = require("@imagekit/nodejs")

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

const createPostController = async (req, res) => {
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
    status: "accepted"
  })

  if (!followRelation) {
    return res.status(403).json({
      message: "Follow user to view posts"
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
      message: "No post exists"
    })
  }

  // allow owner
  if (post.username !== username) {

    const relation = await followModel.findOne({
      follower: username,
      followee: post.username,
      status: "accepted"
    })

    if (!relation) {
      return res.status(403).json({
        message: "Follow user to like posts"
      })
    }
  }

  const like = await likeModel.create({
    user: username,
    post: postId
  })

  res.status(200).json({
    message: "post liked successfully",
    like
  })
}

const getFeedController = async (req, res) => {
  const username = req.user.username

    // 1️⃣ find users you follow
    const following = await followModel.find({
      follower: username,
      status: "accepted"
    }).select("followee -_id")

    // 2️⃣ extract usernames
    const followingUsers = following.map(f => f.followee)

    // include own posts
    followingUsers.push(username)

    // 3️⃣ get posts
    const posts = await postModel.find({
      username: { $in: followingUsers }
    }).populate("user").sort({ createdAt: -1 })

    res.status(200).json({
      message: "Feed fetched successfully",
      posts
    })
}

module.exports = {
  createPostController,
  getPostController,
  getPostDetailsController,
  postLikeController,
  getFeedController
}
