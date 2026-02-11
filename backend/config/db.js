const mongoose = require('mongoose')
require('dotenv').config()

const connectToDb = async()=>{
    await mongoose.connect(`${process.env.MONGODB_URI}/instaxg`)
    .then(()=> {
        console.log('database connected');
    })
}

module.exports = connectToDb