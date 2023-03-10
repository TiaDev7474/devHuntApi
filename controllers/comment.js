const Post = require('../models/post')
const Comment = require('../models/comment')
const fs = require('fs')

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
          let imageArray=[]
          for (const file in req?.files){
              for( const item in req.files[file]){
                imageArray.push(`${req.protocol}://${req.get('host')}/Uploads/${req.files[file][item].filename}`)
              } 
          }
        const commentObject = req.files ? {
            ...req.body,
              imageUrl:imageArray } : {...req.body}

       Comment.findOne({_id:req.params.id})
              .populate({
                path:'author' ,select:'fname lname'
               })
              .populate({
                 path:'reponse',
                 populate:{path:'author', select:'fname lname'}
               })
              .then(comment=>{
                console.log(comment)
                   if(comment.author._id.toString()!== req.auth.userId){
                       return res.status(401).json({message:'not authorized'})
                   }
                   Comment.findByIdAndUpdate({_id:req.params.id},{...commentObject,_id:comment._id},{new:true})
                           .then(()=> res.status(201).json(comment))
                           .catch(err => res.status(400).json({error:err}))
                          
              })
              .catch(err => res.status(400).json({error:err}))
      
}

//delete comment 
exports.deleteComment= (req, res) =>{

     Post.findOne({_id:req.params.postID})
         .populate({path:'author'})
         .populate({path:'comments'})
         .then(post=>{
               const comment = post.comments.find(c => c._id.toString()===req.params.commentID)
               if(comment.author.toString()!==req.auth.userId){
                  return res.status(401).json({message:"not authorized"})
               }
               const indexofComment = post.comments.indexOf(comment)
               post.comments.slice(indexofComment,1)
               //DELETE ALL FILES from this comment
               Promise.all(comment.imageUrl.map(file=>{
                return new Promise((res, rej)=>{
                    try{
                          const filename = file.split('/Uploads')[1]
                          fs.unlink(`./Uploads/${filename}`, (err)=>{
                                  if(err) throw err
                                  console.log(`${filename} was deleted`)
                          })
                          res()
                    }
                    catch (err) {
                        console.error(err);
                        rej(err);
                    }
                })
              }))
               Comment.deleteOne({_id:req.params.commentID})
                      .then(()=> res.status(200).json({message:"comment deleted succesfully!!"}))
                      .catch(err => res.status(400).json({error:err}))
              
         })
         .catch(err => res.status(500).json({error:err}))
       
}



//staring comment




