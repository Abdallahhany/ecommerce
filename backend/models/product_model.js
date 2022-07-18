const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Product Name'],
        trim: true,
        maxLength: [100, 'Product Name Can\'t Exceed 100']
    },
    price: {
        type: Number,
        required: [true, 'Please Enter Product Price'],
        maxLength: [5, 'Product Name Can\'t Exceed 5'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'Please Enter Product Description'],
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
    }],
    category: {
        type: String,
        required: [true, 'Please Select Product Category'],
        enum: {
            values: [
                'Phones',
                'Cameras',
                'Laptops',
                'Accessories',
                'HeadPhones',
                'Foods',
                'Books',
                'Clothes/shoes',
                'Beauty/Health',
                'Sports',
                'OutDoor',
                'Home'
            ],
            message: 'Please Select Product Correct Category'
        },
    },
    seller: {
        type: String,
        required: [true, 'Please Enter Product Seller']
    },
    stock: {
        type: Number,
        required: [true, 'Please Enter Product Stock'],
        maxlength: [5, 'Product Name Can\'t Exceed 5'],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
    }],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('Product', productSchema);