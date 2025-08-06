const express = require('express')
const controller = require('../../controllers/user')
const  { validateRegisterInput } = require('../../middleware/validateRegister')
const router = express.Router()

router.post('/signup', validateRegisterInput, controller.signup)
router.post('/login', controller.login)
router.get('/me', controller.getMe)
router.post('/signout', controller.signout)

module.exports = router

