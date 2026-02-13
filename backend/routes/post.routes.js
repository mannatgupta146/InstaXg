const express = require('express')
const postContoller = require('../controllers/post.controller')

const multer = require('multer')
const upload = multer({storage: multer.memoryStorage()})

const postRouter = express.Router()

postRouter.post('/', upload.single('image'), postContoller.createPostContoller)

module.exports = postRouter