const mongoose = require("mongoose")

const savedSchema = mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
      required: true,
    },
    user: {
      type: String, // username
      required: true,
    },
  },
  { timestamps: true }
)

// prevent duplicate saves
savedSchema.index({ post: 1, user: 1 }, { unique: true })

const savedModel = mongoose.model("saved", savedSchema)

module.exports = savedModel