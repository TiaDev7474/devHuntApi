const Post = require('../models/post')

exports.addPost = (req, res )=>{
     const postObject = JSON.parse(req.body.post)
     delete postObject._author
     const post = new Post({
        ...postObject,
        author:req.auth.userid,
        postUrl:`${req.protocle}://${req.host}/postImage/${req.file.filename}`

     })
     post.save()
        .then(post => res.status(201).json({data: post}))
        .catch(err => res.status(500).json({message:err}))


}

