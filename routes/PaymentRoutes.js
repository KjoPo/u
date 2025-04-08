const express = require('express');
const { saveAddress, savePaymentDetails, verifyOtp } = require('../controllers/PaymentController');
const { checkCaptcha } = require('../middlewares/checkCaptcha');
const router = express.Router();



router.post('/address',saveAddress);
router.post('/payment-details', savePaymentDetails);
router.post('/verify-otp',verifyOtp);

module.exports = router;