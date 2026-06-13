
import User from '../model/user';
import { Request,Response } from 'express';
import  Jwt  from 'jsonwebtoken';


export const register = async(req: Request,res: Response): Promise<void | Response> => {
    console.log('Buraya kadar ulaştı!');
    try{
    
      const user = await User.registerUser(req.body);
      const token = user.generateAuthToken();
     res.status(201).json({
      message: 'user registered succesfully',
      user,
      token
     })
    }catch(error){
        const errorMessage = error instanceof Error? error.message:'register error';
        return res.status(400).json({ message: errorMessage });
    }
}

export const login = async(req:Request,res: Response): Promise<void | Response> => {
     try{
     const user = await User.findByCredentials(req.body);
     const token = user.generateAuthToken();//modelden gelen fonk ile otomotik oluşturuyoruz.


    res.status(200).json({ 
            message: 'Login successful', 
            user, 
            token 
        });

     }catch(error){
        const errorMessage = error instanceof Error? error.message: 'login error'
        return res.status(400).json({ message: errorMessage});
     }
}