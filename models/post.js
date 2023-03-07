const { default: mongoose } = require('mongoose')
const moongose = require('moongose')

const postSchema = mongoose.Schema({
     author:{
        type:mongoose.type.ObjectId,
        ref:'user'
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
        type:mongoose.Schame.types.ObjectId,
        ref:'user'   
    }],
    comments:[{
        type:mongoose.Schema.types.ObjectId,
        ref:'comment'
    }]

},
     {
        timeistamp:true
     }
)

module.exports = moongose.model('Post', postSchema)