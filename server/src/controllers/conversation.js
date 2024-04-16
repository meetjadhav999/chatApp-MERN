const Conversation = require('../models/conversation')
const Message = require('../models/message')



exports.createConversation = async (req,res) => {
    const conversation = new Conversation({
        members:[req.user._id.toString(),req.body.receiverID]
    })
    try{
        const con = await conversation.save()
        res.json(con)
    }catch(e){
        res.status(500).json(e)
    }
}

exports.getConversation = async (req,res) => {
    try{
        const con = await Conversation.find({members:{$in:[req.user._id.toString()]}})

        const data = [...con]
        for (let i = 0; i < data.length; i++) {
            const c = data[i].toObject();
            const messages = await Message.find({ conversation: c._id });
            let lastmessage = messages[messages.length - 1] || ''; // Set default if empty
            c.lastmessage = lastmessage
            data[i]=c
          }
        data.sort((a,b)=>{
            const dateA = new Date(a?.lastmessage.updatedAt) || ''
            const dateB = new Date(b?.lastmessage.updatedAt) || ''
            return dateB - dateA
        })
        console.log(data)
        res.json(data)
    }catch(e){
        res.status(500).json(e)
    }
}