const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs').promises
const userSchema = new mongoose.Schema({

    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                new Error('Invalid Email')
            }
        }
    },

    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password cannot be password')
            }
        }
    },
    profileImgPath:{
        type:String,
        default:''
    },

    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
},{
    timestamps:true
})
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},process.env.SECRET_KEY)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
userSchema.methods.deleteProfilePic = async function(){
    const user = this
    if(user.profileImgPath!='') {
        try {
            const file = path.join(__dirname, '../../',user.profileImgPath)
            await fs.unlink(file);
        } catch (err) {
            console.error(err);
        }
    }
    return false
}
userSchema.statics.authenticate = async function(userId,password){
    let user = await User.findOne({email:userId})
    if(!user){
        user = await User.findOne({username:userId})
        if(!user){
            throw new Error('invalid email or username')
        }
    }
    const isMatched = await bcrypt.compare(password, user.password)
    if(!isMatched){
        throw new Error('invalid password')
    }
    return user
}
userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

const User = mongoose.model('User',userSchema)

module.exports = User