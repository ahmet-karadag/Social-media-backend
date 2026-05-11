
const Message = require('../model/message');

//metinsel mesaj gönderme kısmımız

exports.sendMessage = async (req,res)=> {
    try {
       const savedMessage = await Message.sendNewMessage({
            senderId: req.user.id,
            receiverId: req.body.receiverId,
            content: req.body.content
        });
        
        res.status(201).json({
            message: 'message sent',
            data: savedMessage
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//mesajları getirme kısmım.
exports.getMessages = async (req,res)=>{
    try {
       // Modeldeki statik metodumuz çağırdıkm burada - getchathistory
        const messages = await Message.getChatHistory(req.user.id, req.params.userId);
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};