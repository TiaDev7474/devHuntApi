const express = require('express')
const crtlPost = require('../controllers/post')


const router = express.Router()

router.post('/', crtlPost.addPost)