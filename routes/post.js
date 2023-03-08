const router = require('express').Router()
const postController = require('../controllers/post')
const multer = require('../middleware/multer_config')
const auth = require('../middleware/auth')



router.post('/',auth ,multer.fields([
    {name:"video",maxCount:1},
    {name:"image", maxCount:5}

])
, postController.addPost)

module.exports = router;