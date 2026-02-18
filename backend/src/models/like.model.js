const mongoose = require('mongoose')

const likeSchema = mongoose.Schema({
    post: {
        ref: "posts",
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "post id is required for creating a like"]
    },
    user: {
        type: String,
        required: [true, "username is required for creating a like"]
    }
}, {timestamps: true})

likeSchema.index({post: 1, user: 1}, {unique: true})

const likeModel = mongoose.model('likes', likeSchema)

module.exports = likeModel