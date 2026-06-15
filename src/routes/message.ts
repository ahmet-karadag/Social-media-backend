
  import {Router} from 'express';
  //const express = require('express');
  const router:Router = Router();

  import authMiddleware from '../middleware/auth';
  import *as  messageController from '../controllers/message'
  // const authMiddleware = require('../middleware/auth');
  // const messageController = require('../controllers/message');

  //mesajı gönderme ve alma işlemi
  router.post('/send',authMiddleware,messageController.sendMessage);
  router.get('/:userId',authMiddleware,messageController.getMessages);

  export default router;
  //module.exports = router;