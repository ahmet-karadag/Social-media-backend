
const Message = require('../model/message');

//metinsel mesaj gönderme kısmımız

exports.sendMessage = async (req,res)=> {
    try {
        const {receiverId,content}= req.body;
        const senderId = req.user.id;

         //yeni mesajımızın oluştuğu yer
        const newMessage = new Message({
           sender: senderId,
           receiver:receiverId,
           content: content
        });
        //veritabanına kaydet
        const savedMessage = await newMessage.save();
         
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
        const {userId} = req.params;//sohbet edilecek kişinin id siniş aldık
        const myId = req.user.id;

        const messages = await Message.find({
            $or:[
                {sender: myId, receiver: userId},
                {sender: userId,receiver: myId}
            ]
        }).sort({createdAt: 1})//sort eskiden yeniye sıralıyor 1 yazdığımız için
        .populate('sender','username') //id yerine kullanıcını adını getiriyoruz.
        .populate('receiver', 'username');

         res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};