const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    content:{
        type:String,
        required:true
    },
    star:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'star'
    }],
    reponse:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    imageUrl:[{
        type:String
    }]
}, 
  {
    timestamp:true
  }
)

module.exports = mongoose.model('Comment', commentSchema)