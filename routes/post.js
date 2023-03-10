const router = require('express').Router()
const postController = require('../controllers/post')
const multer = require('../middleware/multer_config')
const auth = require('../middleware/auth')
const commentController = require('../controllers/comment')


//creating post
router.post('/',auth ,multer.fields([
    {name:"video",maxCount:1},
    {name:"image", maxCount:5}

])
, postController.addPost)
//updating post

router.put ('/:id/update',auth,multer.fields([
    {name:"video",maxCount:1},
    {name:"image",maxCount:5}
]),postController.updatePost)
//get all user post

router.get('/getUserPosts',auth, postController.getAllUserPost)
//get one post
router.get('/:id', postController.getOnePost)
//deleting post 
router.delete('/:id',auth ,postController.deleteOne)
// router.post('/:id/delete', auth, postController.deletePost)

//adding comment
router.post('/comment/:id', auth, multer.fields([
    {name:"video",maxCount:1},
    {name:"image",maxCount:5}
]), commentController.addComment)
// router.post('/:id/comment',postController.addcomment)

module.exports = router;