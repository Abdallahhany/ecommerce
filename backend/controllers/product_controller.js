const Product = require('../models/product_model');
const ErrorHandler = require('../utils/error_handler');
const catchAsyncErrors = require('../middelwares/catch_async_error')
const APIFeatures = require('../utils/api_features');
const mongoose = require("mongoose");
const cloudinary = require('cloudinary').v2;


//create New Product => /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {

    try {
        let images = []
        if (typeof req.body.images === 'string') {
            images.push(req.body.images)
        } else {
            images = req.body.images
        }

        let imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.uploader.upload(images[i], {
                folder: 'ecommerce/products'
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }


        req.body.images = imagesLinks;
        req.body.user = req.user._id;

        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            product
        })
    } catch (e) {
        console.log(e.message)
        if (e.message === 'Cannot read property \'length\' of undefined'){
           return next(new ErrorHandler('Please Fill All Fields', 400));
        }
        return next(new ErrorHandler(e.message.split('Product validation failed:')[1], 400));
    }


})

//Get All Products => /api/v1/products
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
    const resPerPage = 4;
    const productsCount = await Product.countDocuments();

    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .search()
        .filter()

    let products = await apiFeatures.query;
    let filteredProductsCount = products.length;

    apiFeatures.pagination(resPerPage)
    products = await apiFeatures.query.clone();


    res.status(200).json({
        success: true,
        productsCount,
        resPerPage,
        filteredProductsCount,
        products
    })
})

exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {

    const products = await Product.find();


    return res.status(200).json({
        success: true,
        products
    })
})

//Get All Products => /api/v1/products
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
    const prodId = req.params.prodId;

    const product = await Product.findById(prodId);
    if (!product) {
        return next(new ErrorHandler('Product Not Found', 404));
    }
    res.status(200).json({
        success: true,
        product
    })
})

//Update Product => /api/v1/admin/product/prodId
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.prodId);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if (images !== undefined) {

        // Deleting images associated with the product
        for (let i = 0; i < product.images.length; i++) {
            const result = await cloudinary.uploader.destroy(product.images[i].public_id)
        }

        let imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.uploader.upload(images[i], {
                folder: 'ecommerce/products'
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }

        req.body.images = imagesLinks

    }

    product = await Product.findByIdAndUpdate(req.params.prodId, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    })

})

//Delete Product => /api/v1/admin/product/prodId
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const prodId = req.params.prodId;
    let product = await Product.findById(prodId);
    if (!product) {
        return next(new ErrorHandler('Product Not Found', 404));
    }
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.uploader.destroy(product.images[i].public_id)
    }
    product.remove();
    return res.status(200).json({
        success: true,
        message: 'Product Deleted Successfully'
    })
});

//create new review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const {rating, comment, productId} = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save({validateBeforeSave: false});

    res.status(200).json({
        success: true
    })
})

// Get Product Reviews   =>   /api/v1/reviews
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})
// Delete Product Review   =>   /api/v1/reviews
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const numOfReviews = reviews.length;

    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})