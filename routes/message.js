
const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const {sendMessage,getMessages} = require('../controllers/message');

//mesajı gönderme işlemi
router.post('/send',authMiddleware,sendMessage);

router.get('/:userId',authMiddleware,getMessages);

module.exports = router;