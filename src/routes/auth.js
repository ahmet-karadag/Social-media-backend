
const express = require('express');
const router = express.Router();

//controller içindeki modülü aldık.
const authController = require('../controllers/auth');

router.post('/register', authController.register);
router.post('/login',authController.login);

module.exports = router;