require('dotenv').config()

const app = require('./src/app.js')
const connectToDb = require('./config/db.js')

connectToDb()

app.listen(3000, ()=> {
    console.log('app is running on port 3000');
    
})