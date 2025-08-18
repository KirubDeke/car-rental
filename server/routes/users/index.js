const express = require('express')
const controller = require('../../controllers/user')
const  { validateRegisterInput } = require('../../middleware/validateRegister')
const isAuthenticated = require('../../middleware/isAuthenticated')
const uploadProfile = require('../../middleware/uploadProfileImage')
const isAdmin = require('../../middleware/isAdmin')
const router = express.Router()

router.post('/signup', validateRegisterInput, controller.signup)
router.post('/login', controller.login)
router.get('/me', controller.getMe)
router.post('/logout', isAuthenticated, controller.signout)
router.get('/profile', isAuthenticated, controller.profile)
router.get('/getAllUsers', isAuthenticated, isAdmin, controller.getAllUsers)
router.delete('/deleteUser/:id', isAuthenticated, isAdmin, controller.deleteUser)
router.get('/fetchProfile/:id', isAuthenticated, controller.getProfile)
router.put('/updateProfile/:id', isAuthenticated,  uploadProfile.single("photo"), controller.updateProfile)

module.exports = router

