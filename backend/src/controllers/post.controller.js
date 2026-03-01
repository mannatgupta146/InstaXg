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
  try {
    const username = req.user.username;
    const postId = req.params.postId;

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 🔐 permission check (owner allowed)
    if (post.username !== username) {
      const relation = await followModel.findOne({
        follower: username,
        followee: post.username,
        status: "accepted",
      });

      if (!relation) {
        return res.status(403).json({
          message: "Follow user to like posts",
        });
      }
    }

    // 🔍 check existing like
    const existingLike = await likeModel.findOne({
      post: postId,
      user: username,
    });

    let liked;

    // ❤️ UNLIKE
    if (existingLike) {
      await likeModel.deleteOne({
        post: postId,
        user: username,
      });
      liked = false;
    } else {
      // ❤️ LIKE
      await likeModel.create({
        post: postId,
        user: username,
      });
      liked = true;
    }

    // ⭐ ALWAYS recalc count after operation
    const likesCount = await likeModel.countDocuments({
      post: postId,
    });

    res.status(200).json({
      liked,
      likesCount,
    });

  } catch (error) {
    console.error("Like error:", error);

    // duplicate safe fallback
    if (error.code === 11000) {
      return res.status(200).json({ liked: true });
    }

    res.status(500).json({ message: "Server error" });
  }
};

const getFeedController = async (req, res) => {
  const username = req.user.username
  const userId = req.user.id

  // ✅ users you follow
  const following = await followModel
    .find({ follower: username, status: "accepted" })
    .select("followee")

  const followingUsernames = following.map(f => f.followee)

  // ✅ get users data
  const followeeUsers = await userModel
    .find({ username: { $in: followingUsernames } })
    .select("_id username profilePic")

  const userIds = followeeUsers.map(u => u._id.toString())
  userIds.push(userId)

  // ✅ fetch posts
  const posts = await postModel
    .find({ user: { $in: userIds } })
    .sort({ createdAt: -1 })

  // ✅ fetch likes
  const likes = await likeModel.find({
    post: { $in: posts.map(p => p._id) }
  })

  // ✅ build profile pic map
  const profilePicMap = {}
  followeeUsers.forEach(u => {
    profilePicMap[u.username] = u.profilePic || null
  })

  const me = await userModel.findById(userId).select("username profilePic")
  profilePicMap[me.username] = me.profilePic || null

  // ✅ check follow relation for feed users
  const relations = await followModel.find({
    follower: username,
    followee: { $in: posts.map(p => p.username) },
    status: "accepted",
  })

  const postsWithData = posts.map(post => {
    const postLikes = likes.filter(
      l => l.post.toString() === post._id.toString()
    )

    const likedByCurrentUser = postLikes.some(
      l => l.user === username
    )

    const isFollowing = relations.some(
      r => r.followee === post.username
    )

    return {
      ...post.toObject(),
      profilePic: profilePicMap[post.username] || null,
      likesCount: postLikes.length,
      likedByCurrentUser,
      isFollowing,
    }
  })

  res.status(200).json({ posts: postsWithData })
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
