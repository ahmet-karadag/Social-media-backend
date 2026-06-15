
  // const express = require('express');
  import { Router } from 'express';
  const router:Router = Router();
  import *as postController from '../controllers/post';
  import  authMiddleware from '../middleware/auth'

  // const postController = require('../controllers/post');
  // const authMiddleware = require('../middleware/auth');

  router.post('/create',authMiddleware,postController.createPost);
  router.get('/all', postController.getAllPosts);

  export default router;
  // module.exports = router;