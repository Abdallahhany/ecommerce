const User = require('../models/user_model');
const ErrorHandler = require('../utils/error_handler');
const catchAsyncErrors = require('../middelwares/catch_async_error')
const sendToken = require('../utils/jwt_token');
const sendEmail = require('../utils/send_email');
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;

exports.registerUser = catchAsyncErrors(async (req, res) => {
    const {name, email, password} = req.body;

    const result = await cloudinary.uploader.upload(req.body.avatar, {
        folder: 'ecommerce/avatars',
        // width: 150,
        // crop: 'scale'
    },)
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
        }
    });
    sendToken(user, 200, res);
})

// Login User  =>  /a[i/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const {email, password} = req.body;

    // Checks if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    // Finding user in database
    const user = await User.findOne({email}).select('+password')

    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    sendToken(user, 200, res);
})

//forget password
exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    if (!user) {
        return next(new ErrorHandler('User With This Email Not Found', 404));
    }
    // get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});

    //create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;
    const message = `To reset Your Password click on the following link:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`

    try {
        await sendEmail({
            email: user.email,
            subject: 'ecommerce Password Recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});

        return next(new ErrorHandler(error.message, 500))
    }

})

// Reset Password   =>  /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    })
    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res)
})

//get currently logged in  user 

exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    });
})

// Update || Change Password

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if (!isMatched) {
        return next(new ErrorHandler('Old password is incorrect'));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res)

})

// Update user profile   =>   /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    };

    if (req.body.avatar !== '') {
        const user = await User.findById(req.user.id);

        const image_id = user.avatar.public_id;
        await cloudinary.uploader.destroy(image_id);
        const result = await cloudinary.uploader.upload(req.body.avatar, {
            folder: 'ecommerce/avatars',
            // width: 150,
            // crop: 'scale'
        },)

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})

// Logout user   =>   /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
})

// Admin controllers


// Get all users   =>   /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})

// Get user details   =>   /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User with id: ${req.params.id} not found`))
    }

    res.status(200).json({
        success: true,
        user
    })
})

// Update user profile   =>   /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})

// delete user profile   =>   /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User with id: ${req.params.id} not found`))
    }
    const image_id = user.avatar.public_id;
    await cloudinary.uploader.destroy(image_id);
    await user.remove();

    res.status(200).json({
        success: true
    })
})
