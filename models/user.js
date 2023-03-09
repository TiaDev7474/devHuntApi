const mongoose = require('mongoose')
const Post = require('../models/post')

const userSchema = mongoose.Schema({
    fname: {
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }],
},
   {
     timestamp:true
   }
)
module.exports = mongoose.model('User',userSchema) 
