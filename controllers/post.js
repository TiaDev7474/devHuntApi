const Post = require('../models/post')
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
      .then(post => res.status(201).json({data: post}))
      .catch(err => res.status(500).json({message:err}))

}
