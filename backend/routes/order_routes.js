const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order_controller');
const {isAuth, authRoles} = require("../middelwares/auth_middelware");


router.post('/order/new', isAuth, orderController.newOrder);
router.get('/order/:id', isAuth, orderController.getSingleOrder);
router.get('/orders/me', isAuth, orderController.myOrders);
router.get('/admin/orders', isAuth, authRoles('admin'), orderController.allOrders);
router.put('/admin/order/:id', isAuth, authRoles('admin'), orderController.updateOrder);
router.delete('/admin/order/:id', isAuth, authRoles('admin'), orderController.deleteOrder);


module.exports = router;