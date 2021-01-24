const express = require('express')
const featureController = require('../controllers/featureController')
const { verifyToken } = require('../middleware/customMiddleware')

const router = express.Router()


router.patch('/patch-object', verifyToken, featureController.patch_json_patch)

module.exports = router
