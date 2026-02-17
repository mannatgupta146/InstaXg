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

  const postId = req.params.postId

  const post = await postModel.findById(postId)

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    })
  }

  const isValidUser = post.user.toString() == userId

  if (!isValidUser) {
    return res.status(403).json({
      message: "forbidden content",
    })
  }

  res.status(200).json({
    message: "post details fetched",
    post,
  })
}

module.exports = {
  createPostController,
  getPostController,
  getPostDetailsController,
}
