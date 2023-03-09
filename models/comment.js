const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
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
        ref:'comment'
    }],
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    }
}, 
  {
    timestamp:true
  }
)

module.exports = mongoose.model('Comment', commentSchema)