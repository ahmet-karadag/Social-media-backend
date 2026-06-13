
import { Request,Response } from 'express';
import Message from '../model/message';
import User, { IUserDocument } from '../model/user';

interface AuthenticatedRequest extends Request {
    user?: IUserDocument & { _id: string | Object }; //_id alanının tipini burada garantiye alıyoruz
}
//metinsel mesaj gönderme kısmımız

export const sendMessage = async (req:AuthenticatedRequest,res:Response): Promise<void | Response>=> {
    try {

        if(!req.user){
            return res.status(401).json({ message: 'user message doesnt exist'});
        }
       const savedMessage = await Message.sendNewMessage({
            senderId: req.user._id.toString(),
            receiverId: req.body.receiverId,
            content: req.body.content
        });
        
        return res.status(201).json({
            message: 'message sent',
            data: savedMessage
        });
    } catch (error) {
        const errorMessage = error instanceof Error? error.message: ' an unknown error'
        return res.status(400).json({ message: errorMessage});
    }
};

//mesajları getirme kısmım.
export const getMessages = async (req:AuthenticatedRequest,res:Response): Promise<void | Response>=>{
    try {
        if(!req.user) {
           return res.status(401).json({ message: 'user message doesnt get'}); 
        }
        const currentUserId = req.user._id.toString();
        const chatPartnerId = req.params.userId as string;
       // Modeldeki statik metodumuz çağırdıkm burada - getchathistory
        const messages = await Message.getChatHistory(currentUserId, chatPartnerId);
        return res.status(200).json(messages);
    } catch (error) {
        const errorMessage = error instanceof Error? error.message: 'messages didnt get';
        return res.status(500).json({message: errorMessage});
    }
};