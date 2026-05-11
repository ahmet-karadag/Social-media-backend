
const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');


//proteched route' muz
router.get('/me', authMiddleware, (req, res) => {
   
    
    res.status(200).json({
        success: true,
        user: req.user
    });
});

module.exports = router;