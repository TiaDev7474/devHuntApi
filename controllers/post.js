
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

         Post.findOne({_id:req.params.id})
          .populate({
           path:'author' ,select:'fname lname'
          })
          .populate({
            path:'comments',
            populate:{path:'author', select:'fname lname'}
          })
          .then(post=>{
            console.log(post)
            if(post.author._id.toString()!==req.auth.userId){
              return res.status(401).json({message:'not authorized'})
            }else{
              Post.findByIdAndUpdate({_id:req.params.id},{...postObject,_id:post._id},{new:true})
              .then(updated => res.status(201).json(updated))
              .catch(err=> res.status(400).json({error:err}))
            }
            
          })
          .catch(err => res.status(400).json({error:err}))
          
          //  User.findOne({_id:req.auth.userId}).
          //       populate({path:'posts'})
          //       .then((user)=>{
        
          //           const post = user.posts.find((p) => p._id.toString()===req.params.id.toString());
          //                if(!post){
          //                   return res.status(404).json({error:"post not found"})
          //               }
          //               if(post.author.toString()!== req.auth.userId){
          //                   return res.status(401).json({error:"Unauthorized"})
          //              }
          //              console.log(post._id)
          //              Post.findByIdAndUpdate(post._id,{...postObject, _id:post._id,author:req.auth.userId},{new:true})
          //                .then((updatedPost)=>{
          //                   req.status(201).json(updatedPost)
          //                })
          //                .catch(err=> res.status(500).json({error:"failed to update post"}))
          //       })
          //       .catch(err => res.status(404).json({error:err}))
   }    





// get all user posts
exports.getAllUserPost = (req, res)=>{
      User.findById(req.auth.userId)
          .populate({path: 'posts'})
          .then(user =>{
               res.status(200).json(user)
          })
          .catch(err=> res.status(500).json({error:err}))
}
// get one post using post_id in params
exports.getOnePost = (req,res)=>{
     User.findById(req.auth.userId)
         .populate({
          path:'posts',
          populate:{path :'comments',populate:{path:'author',select:'fname lname'}}

        })
         .then(user=>{
              if(!user){
               return  res.status(404).json({message:"post not found"})
              }
              res.status(200).json(user)
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
              const indexOfPost = user.posts.indexOf(post)
              const removePost = user.posts.splice(indexOfPost,1)
              console.log(removePost)
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

