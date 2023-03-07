const express = require('express')
const crtlUser = require('../controllers/user')
const router= express.Router()

router.post('/login',crtlUser.login)