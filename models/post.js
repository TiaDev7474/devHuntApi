
const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
     author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
     },
     Title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        max:250
    },
    postUrl:[{
        type:String
    }],
    like:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'   
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],

},
     {
        timestamp:true
     }
)

module.exports = mongoose.model('Post', postSchema)