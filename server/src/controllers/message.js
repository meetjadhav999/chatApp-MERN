const Message = require('../models/message')

exports.newMessage = async(req,res)=>{
    const message = new Message(req.body)
    try{
        saveMessage = await message.save()
        res.json(saveMessage)
    }catch(e){
        res.status(500).json(e)
    }
}

exports.getMessage = async (req,res)=>{
    try{
        const messages = await Message.find({conversation:req.params.conversationID})
        res.json(messages)
    }
    catch(e){
        res.status(400).json(e)
    }
}