const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "..", ".env") })
const connectToDb = require("../src/config/db")
const mongoose = require("mongoose")
const postModel = require("../src/models/post.model")
const userModel = require("../src/models/user.model")

const run = async () => {
  try {
    console.log("MONGODB_URI=", process.env.MONGODB_URI)
    await connectToDb()
    console.log("Connected to DB")

    const posts = await postModel.find({
      $or: [
        { username: { $exists: false } },
        { username: null },
        { username: "" },
      ],
    })
    console.log("Posts to update:", posts.length)

    let updated = 0

    for (const post of posts) {
      if (!post.user) continue
      const user = await userModel.findById(post.user).select("username")
      if (user && user.username) {
        post.username = user.username
        await post.save()
        updated++
      }
    }

    console.log(`Updated ${updated} posts with usernames.`)
    process.exit(0)
  } catch (err) {
    console.error("Migration error", err)
    process.exit(1)
  }
}

run()
