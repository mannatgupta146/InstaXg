const mongoose = require('mongoose')
require('dotenv').config()

const connectToDb = async()=>{
    mongoose.connect(`${process.env.MONGODB_URI}/instaxg`)
    .then(()=> {
        console.log('database connected');
    })
}

module.exports = connectToDb