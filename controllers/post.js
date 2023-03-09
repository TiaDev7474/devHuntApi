
const Post = require('../models/post')
const User = require('../models/user')
const mongoose = require('mongoose')
const fs= require('fs')

//creating post
exports.addPost = (req, res , next)=>{  
     let photoArray=[]
      for (const file in req?.files){
          for( const item in req.files[file]){
            photoArray.push(`${req.protocol}://${req.get('host')}/Uploads/${req.files[file][item].filename}`)
          } 
      }
    const postObject = req.files ? {
         ...req.body,
          postUrl:photoArray } : {...req.body}
          const  post = new Post({
            ...postObject,
           author:req.auth.userId,
          })
   
    post.save()
        .then(post => {  
            console.log(`req.auth.userId: ${req.auth.userId}`);
                User.findByIdAndUpdate(req.auth.userId,{$push:{ posts: post._id }},{new:true})
                      .then((user)=>{
                         return res.status(201).json({user:user,post:post})
                       })
                       .catch(err => res.status(500).json({message:err}))       
        }         
    )
        .catch(err => res.status(500).json({message:err}))
}
//updating pôst 
exports.updatePost= (req, res)=>{
   
    let photoArray=[]
    for (const file in req?.files){
        for( const item in req.files[file]){
          photoArray.push(`${req.protocol}://${req.get('host')}/Uploads/${req.files[file][item].filename}`)
        }
    }
    const postObject = req.files ? {
        ...req.body,
         postUrl:photoArray } : {...req.body}

   User.findOne({_id:req.auth.userId}).
        populate({
            path:'posts',
            populate: { path:'comments'}
        })
        .then((user)=>{

            const post = user.posts.find((p) => p._id.toString()===req.params.id.toString());
                 if(!post){
                    return res.status(404).json({error:"post not found"})
                }
                if(post.author!== req.auth.userId){
                    return res.status(401).json({error:"Unauthorized"})
               }
               Post.updateOne({_id:req.params.id}, postObject)
                 .then((updatedPost)=>{
                    req.status(201).json(updatedPost)
                 })
                 .catch(err=> res.status(500).json({error:"failed to update post"}))

               

        })
        .catch(err => res.status(404).json({error:err}))

    }    





// get all user posts
exports.getAllUserPost = (req, res)=>{
      User.findById(req.auth.userId)
          .populate({path: 'posts'})
          .then(user =>{
               res.status(200).json(user.posts)
          })
          .catch(err=> res.status(500).json({error:err}))
}
// get one post using post_id in params
exports.getOnePost = (req,res)=>{
     Post.findById(req.params.id)
         .then(post=>{
              if(!post){
               return  res.status(404).json({message:"post not found"})
              }
              res.status(200).json(post)
         })
         .catch(err => res.status(500).json({error: err}))
}

//deleting post 
exports.deleteOne = (req, res)=>{
    
     User.findById({_id:req.auth.userId})
         .populate({
             path:'posts'
         })
         .then(user =>{
              const post = user.posts.find(p => p._id.toString() === req.params.id)
              console.log(user.posts)
              if(!post){
                return res.status(404).json({error:"Post not found"})
              }
              if(post.author.toString()!==req.auth.userId){
                return res.status(403).json({error:"Forbidden"})
              }
           
              Promise.all(post.postUrl.map(file=>{
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
              Post.findByIdAndDelete(post._id)
                  .then(()=>res.status(200).json({message:"Post deleted succesfully"}))
                  .catch(err=>res.status(500).json({error:err}))
         })
         .catch(err=> res.status(500).json({error:err}))
         

} 
//comment post 


//update comments post 


//delete comment
