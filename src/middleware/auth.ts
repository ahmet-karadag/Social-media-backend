
import {Request, Response,NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import User from '../model/user';
import { Interface } from 'node:readline';


interface DecodedToken {
     id: String;
     username: string;
     iat: number;
     exp: number
}




export const authMiddleware = async(req:Request,res: Response,next:NextFunction): Promise<void | Response>=>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer')){
      return res.status(401).json({message: 'no token'});
    }

    const token = authHeader.split(' ')[1];

    try {
        const secret = process.env.JWT_SECRET;
        if(!secret){
           return res.status(500).json({message: 'jwt secret is missing in server'});
        }
     const decoded = jwt.verify(token, secret!) as unknown as DecodedToken;//secret'ın undefeined olmadığını belirttim yoksaveriyor 
        
     const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        (req as any).user = user;//token içindekileri requeste ekle
        next();
    } catch (error) {
        return res.status(401).json({message: 'expired token'});
    }
}

export default authMiddleware;