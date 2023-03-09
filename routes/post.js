const router = require('express').Router()
const postController = require('../controllers/post')
const multer = require('../middleware/multer_config')
const auth = require('../middleware/auth')


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
//
router.get('/:id', postController.getOnePost)
//deleting post 
router.delete('/:id',auth ,postController.deleteOne)
// router.post('/:id/delete', auth, postController.deletePost)

//addint comment
// router.post('/:id/comment',postController.addcomment)

module.exports = router;