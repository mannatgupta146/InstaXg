const mongoose = require("mongoose")

const followSchema = mongoose.Schema(
  {
    follower: {
      type: String,
    },
    followee: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
      enum: {
        values: ["active", "pending", "rejected"],
        message: "status can be only active, pending or rejected",
      },
    },
  },
  { timestamps: true },
)

followSchema.index({ follower: 1, followee: 1 }, { unique: true })

const followModel = mongoose.model("follows", followSchema)

module.exports = followModel
