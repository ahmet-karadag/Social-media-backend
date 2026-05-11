
const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const messageController = require('../controllers/message');

//mesajı gönderme işlemi
router.post('/send',authMiddleware,messageController.sendMessage);

router.get('/:userId',authMiddleware,messageController.getMessages);

module.exports = router;