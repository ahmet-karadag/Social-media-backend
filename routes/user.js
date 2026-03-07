
const express = require('express');
const router = express.Router();
const authMidleware = require('../middleware/auth');
const User = require('../model/user');

//proteched route' muz
router.get('/me',authMidleware, (req,res)=>{
     res.status(200).json({message: 'kullanici bilgileri korundu', user: req.user});
});

module.exports = router;