const express = require('express')
const router = express.Router();

const paymentController = require('../controllers/payment_controller')

const {isAuth} = require('../middelwares/auth_middelware')

router.post('/payment/process', isAuth, paymentController.processPayment);
router.get('/stripe/api', isAuth, paymentController.sendStripeApi);


module.exports = router;