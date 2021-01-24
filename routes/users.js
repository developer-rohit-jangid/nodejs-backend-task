const express = require('express')
const userController = require('../controllers/userController')

const router = express.Router()

router.post('/login', userController.user_login_post_controller)

module.exports = router
