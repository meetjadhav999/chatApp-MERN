const express = require('express')
const path = require('path')
const userAPI = require('./api/user.js')
const conversationAPI = require('./api/conversation.js')
const messageAPI = require('./api/message.js')

const mongoose = require('mongoose')
const cors = require('cors')

mongoose.connect(process.env.MONGO_DB_PATH)

const app = express()
app.use(express.json())

app.use(cors())

app.use('/api/users',userAPI)
app.use('/api/conversation',conversationAPI)
app.use('/api/message',messageAPI)

app.listen(process.env.PORT ,()=>{
    console.log('Server Running on port ')
    console.log(process.env.PORT)
})