const mongoose = require("mongoose")

const postSchema = mongoose.Schema(
  {
    caption: {
      type: String,
      default: "",
    },
    imgUrl: {
      type: String,
      required: [true, "imgUrl is required for creating a post"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "user id is required"],
    },
    username: {
      type: String,
      required: [true, "username is required"],
    },
  },
  { timestamps: true },
)

const postModel = mongoose.model("posts", postSchema)

module.exports = postModel
