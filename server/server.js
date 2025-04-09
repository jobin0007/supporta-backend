
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const errorHandler = require('./middleware/errorHandler')
const  routes  = require('./routes')
const cookie = require('cookie-parser')
const app = express()


const connectDB=async() =>{
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log("DB running ");
        
    } catch (error) {
        console.log(error)
    }
}

connectDB()



app.use(cookie())
app.use(express.json())

app.use(routes)


app.use(errorHandler)

app.listen(process.env.PORT,()=>{
    console.log(`running successfully ${process.env.PORT}`)
})
