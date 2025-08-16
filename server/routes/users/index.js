const express = require('express')
const controller = require('../../controllers/user')
const  { validateRegisterInput } = require('../../middleware/validateRegister')
const isAuthenticated = require('../../middleware/isAuthenticated')
const isAdmin = require('../../middleware/isAdmin')
const router = express.Router()

router.post('/signup', validateRegisterInput, controller.signup)
router.post('/login', controller.login)
router.get('/me', controller.getMe)
router.post('/logout', isAuthenticated, controller.signout)
router.get('/profile', isAuthenticated, controller.profile)
router.get('/getAllUsers', isAuthenticated, isAdmin, controller.getAllUsers)
router.delete('/deleteUser/:id', isAuthenticated, isAdmin, controller.deleteUser)

module.exports = router

