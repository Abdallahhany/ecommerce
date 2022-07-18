const User = require('../models/user_model')

const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/error_handler");
const catchAsyncErrors = require("./catch_async_error");

// Checks if user is authenticated or not
exports.isAuth = catchAsyncErrors(async (req, res, next) => {

    const { token } = req.cookies;
    // console.log(token);
    if (!token) {
        return next(new ErrorHandler('Login first to access this resource.', 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);

    next();
})

// Handling users roles
exports.authRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`, 403));
        }
        next();
    }
}