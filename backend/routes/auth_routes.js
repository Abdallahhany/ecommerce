const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');
const { isAuth, authRoles } = require("../middelwares/auth_middelware");

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/logout', authController.logout);
router.post('/password/forget', authController.forgetPassword);
router.put('/password/reset/:token', authController.resetPassword);
router.get('/me', isAuth, authController.getUserProfile);
router.put('/password/update', isAuth, authController.updatePassword);
router.put('/me/update', isAuth, authController.updateProfile);


// Admin Routes
router.get('/admin/users', isAuth, authRoles('admin'), authController.allUsers);
router.get('/admin/user/:id', isAuth, authRoles('admin'), authController.getUserDetails);
router.put('/admin/user/:id', isAuth, authRoles('admin'), authController.updateUser);
router.delete('/admin/user/:id', isAuth, authRoles('admin'), authController.deleteUser);


module.exports = router;