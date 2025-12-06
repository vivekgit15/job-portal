const express = require('express');
const router = express.Router();
const {
     register,
     login ,
     forgotPassword,
     resetPassword,
     changePassword
    } = require('../controllers/auth.controller');
    const protect = require('../middlewares/auth')

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', protect , changePassword);

module.exports = router;
