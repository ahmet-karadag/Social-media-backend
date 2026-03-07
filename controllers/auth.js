
const User = require("../model/user");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


exports.register = async(req,res) => {
    try{
      const {username, email, password } = req.body;
      console.log(username,email,password);

      if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password,salt);
     //kullanıcı objesi ve kaydetme işlemim
     const newUser = new User({
        username,
        email,
        password: hashedPassword
     });
     const savedUser = await newUser.save();

     res.status(201).json({message: 'user registered succesfully', user: savedUser});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

exports.login = async(req,res) => {
     try{
     const{email,password} = req.body;
     if(!email || !password){
        return res.status(400).json({message: 'all fields are requred'});
     }
    //kullanıcı db varmı yokmu kontrolu
     const user = await User.findOne({email});
     if(!user){
        return res.status(400).json({message: 'there is no user'});
     }
     //şifre kontrolu
     const isMatch = await bcrypt.compare(password, user.password);
     if(!isMatch){
        return res.status(400).json({message: 'password is wrong'});
     }

     //jwt üretimi
     const token = jwt.sign({
        id: user._id, 
        username: user.username
     },
     process.env.JWT_SECRET,
     {expiresIn: '1h'}
    );

    res.status(200).json({ message: "Login successful", token });

     }catch(error){
         res.status(500).json({message: error.message});
     }
}