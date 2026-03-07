
const express = require('express');
const router = express.Router();

//controller içindeki register fonk alıyoruz.
const { register } = require('../controllers/auth');
const { login } = require('../controllers/auth');

router.post('/register', register);
router.post('/login',login);

module.exports = router;