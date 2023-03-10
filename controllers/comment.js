const Post = require('../models/post')
const Comment = require('../models/comment')

//add comment
exports.addComment = (req, res)=>{
    let imageArray=[]
    for (const file in req?.files){
        for( const item in req.files[file]){
          imageArray.push(`${req.protocol}://${req.get('host')}/Uploads/${req.files[file][item].filename}`)
        } 
    }
  const commentObject = req.files ? {
       ...req.body,
        imageUrl:imageArray } : {...req.body}
        const  comment = new Comment({
          ...commentObject,
         author:req.auth.userId,
         post:req.params.id
        })   
    comment.save()
           .then(comment=>{
              Post.findByIdAndUpdate(req.params.id,{$push:{comments:comment._id}},{new:true})
                  .then(post=>res.status(201).json({comment:comment,post:post} ))
                  .catch(err=> res.status(500).json({error:err}))
           })
           .catch(err=> res.status(500).json({error:err}))
}



//update coment
exports.updateComment= (req , res)=>{
       Post
}



//delete comment 



//staring comment




