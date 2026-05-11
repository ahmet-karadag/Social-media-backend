
const User = require("../model/user");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


exports.register = async(req,res) => {
    console.log("Buraya kadar ulaştı!");
    try{
    
      const user = await User.registerUser(req.body);
      const token = user.generateAuthToken();
     res.status(201).json({
      message: 'user registered succesfully',
      user,
      token
     })
    }catch(error){
       res.status(400).json({ message: error.message });
    }
}

exports.login = async(req,res) => {
     try{
     const user = await User.findByCredentials(req.body);
     const token = user.generateAuthToken();//modelden gelen fonk ile otomotik oluşturuyoruz.


    res.status(200).json({ 
            message: "Login successful", 
            user, 
            token 
        });

     }catch(error){
         res.status(400).json({ message: error.message });
     }
}