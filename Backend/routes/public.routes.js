const express = require('express');
const router = express.Router();
const controller = require('../controllers/publicPatientController');

// Public patient registration endpoints
router.post('/register', controller.registerPublicPatient);
router.post('/verify-otp', controller.verifyOtp);
router.post('/send-otp', controller.sendOtp);
router.post('/check-otp', controller.checkOtp);

module.exports = router;
