const postModel = require('../models/post.model')
const ImageKit = require('@imagekit/nodejs')
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY, // This is the default and can be omitted
});

const createPostContoller = async(req, res) =>{
    console.log(req.body, req.file)

    const file = await imagekit.files.upload({
        file: await ImageKit.toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: "Test",
        folder: "instaxg"
    })

    res.send(file)
}

module.exports = {
    createPostContoller
}