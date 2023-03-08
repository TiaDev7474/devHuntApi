const mongoose = require('mongoose')

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
},
   {
     timeistamp:true
   }
)
module.exports = mongoose.model('User',userSchema) 
