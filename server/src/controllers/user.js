const User = require('../models/user.js')
const path = require('path')
const multer = require('multer')
const fs = require('fs').promises

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return cb(new Error('file must be an image'))
        }
        cb(undefined, true)
    }
});


exports.upload = multer({ storage: storage });

exports.register = async (req, res) => {
    console.log('ok')
    const user = new User(req.body)
    if(req.body.password.lenght < 8){
        return res.status(400).json({error:"password must be more than 8 characters"})
    }
    
    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).json(token)
    }catch(e){
        if(await User.findOne({email:req.body.email})){
            return res.status(400).json({error:"email already exist"})
        }
        
        res.status(400).json({error:'invalid data'})
    }
}

exports.updateProfilepic = async (req, res) => {
    if (req.user.profileImgPath != '') {
        req.user.deleteProfilePic()
    }
    let imagePath = ''
    if (req.file) {
        imagePath = '/uploads/' + req.file.filename; 
    }
    req.user.profileImgPath = imagePath
    req.user.save()
    res.send('profile picture saved')
}

exports.login = async(req,res)=>{
    try{
        if(!req.body.user || !req.body.password){
            return res.status(400).json({error:"email or password is not provided"})
        }
        const user = await User.authenticate(req.body.user,req.body.password) 
        const token = await user.generateAuthToken()
        res.json(token)

    }catch(e){
        res.status(400).json({error:"invalid username or password"})
    }
}

exports.profile = (req,res)=>{
    res.json(req.user)
}

exports.logout = async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
}

exports.deleteUser = async(req,res)=>{
    try{
        if (req.user.profileImgPath != '') {
            await req.user.deleteProfilePic()
        }
        await req.user.deleteOne()
        res.send(req.user)
    }catch(e){
        res.status(400).send('error')
    }
}

exports.update = async(req,res)=>{
    try{
        if(!req.body.CurPassword || !req.body.NewPassword){
            return res.status(400).send("invalid request")
        }
        const user = await User.authenticate(req.user.email,req.body.CurPassword)
        user.password = req.body.NewPassword
        await user.save()
        res.send(user)
    }catch(e){

    }
}

exports.getProfilepic = async(req,res) =>{
    try{
        const img = await User.findOne({ _id: req.params.id })
        let imagePath
        if(img.profileImgPath =='' || img.profileImgPath == undefined){
            imagePath = path.join(__dirname, '../../uploads/blank-profile.webp' )
            return res.sendFile(imagePath)
        }
        imagePath = path.join(__dirname, '../../', img.profileImgPath)
        return res.sendFile(imagePath)
    }
    catch(e){
        res.status(400).send("Invalid user ID")
    }
    
}

exports.searchUser = async (req,res)=>{
    try{
        const users = await User.find({username:req.params.username})
        if(!users){
            return res.status(400).json({error:"no user found"})
        }
        res.json(users)
    }
    catch{
        res.status(400).json({error:"no user found"})
    }
}

exports.getUser = async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        res.json(user)
    }
    catch(e){
        res.status(400).json(e)
    }
}