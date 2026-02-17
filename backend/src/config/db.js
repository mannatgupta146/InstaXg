const mongoose = require('mongoose')
const connectToDb = async()=>{
    await mongoose.connect(`${process.env.MONGODB_URI}/instaxg`)
    .then(()=> {
        console.log('database connected');
    })
}

module.exports = connectToDb