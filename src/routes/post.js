
const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const authMiddleware = require('../middleware/auth');

router.post('/create',authMiddleware,postController.createPost);
router.get('/all', postController.getAllPosts);

module.exports = router;