const express = require('express');
const router = express.Router();
const productController = require('../controllers/product_controller');
const {isAuth, authRoles} = require('../middelwares/auth_middelware');


//Get All Products
router.get('/products', productController.getProducts);

//get only one Product
router.get('/product/:prodId', productController.getSingleProduct);

// Post New Product
router.post('/admin/product/new', isAuth, authRoles('admin'), productController.newProduct);

// Update existed Product
router.put('/admin/product/:prodId', isAuth, authRoles('admin'), productController.updateProduct);

// Delete existed Product
router.delete('/admin/product/:prodId', isAuth, authRoles('admin'), productController.deleteProduct);

router.get('/admin/products', isAuth, authRoles('admin'), productController.getAdminProducts);


router.put('/review', isAuth, productController.createProductReview);

router.get('/reviews', isAuth, productController.getProductReviews);

router.delete('/reviews', isAuth, productController.deleteReview);


module.exports = router;