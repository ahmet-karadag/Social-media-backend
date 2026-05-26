
import mongoose,{Document,Model,Schema} from "mongoose";

export interface IMessage {
  sender: mongoose.Schema.Types.ObjectId;
  receiver: mongoose.Schema.Types.ObjectId;
  content: String;
  createdAt?: Date;
  updatedAt?: Date;
}
interface ISendMessageData {
  senderId: string;
  receiverId: string;
  content: string;
}

interface IMessageModel extends Model<IMessageDocument> {
  sendNewMessage(data: ISendMessageData): Promise<IMessageDocument>;
  getChatHistory(myId: String, userId: String): Promise<IMessageDocument>
}
export type IMessageDocument = IMessage & Document;

const messageSchema = new mongoose.Schema<IMessageDocument,IMessageModel>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

messageSchema.statics.sendNewMessage = async function (data: ISendMessageData): Promise<IMessageDocument> {
  const Message = this as IMessageModel;
  //eğer data gelmzse hata dönecek.
  if (!data || typeof data !== "object") {
    throw new Error("missing data");
  }
  
  const { senderId, receiverId, content } = data;

  if (!senderId || !receiverId || !content) {
    throw new Error(
      "Missing fields: senderId, receiverId and content are required",
    );
  }
  if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
        throw new Error('invalid id for mongodb');
    }

  if (senderId.toString() === receiverId.toString()) {
    throw new Error("Sender and receiver cannot be the same user");
  }

  const messageContent = String(content).trim();

  if (messageContent.length === 0) {
    throw new Error("Content cannot be empty");
  }
  
  const newMessage = new Message({
    sender: new mongoose.Types.ObjectId(senderId),
    receiver: new mongoose.Types.ObjectId(receiverId),
    content: messageContent,
  });
  return await newMessage.save();
};

// Mesaj Geçmişini Getirmemiz
messageSchema.statics.getChatHistory = async function (myId: string, userId: string): Promise<IMessageDocument[]> {
  const Message = this as IMessageModel;  
  if (!mongoose.Types.ObjectId.isValid(myId) || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user IDs provided for chat history');
  }
  
  return await Message.find({
    $or: [
      { sender: myId, receiver: userId },
      { sender: userId, receiver: myId },
    ],
  }as any )
    .sort({ createdAt: 1 })
    .populate("sender", "username")
    .populate("receiver", "username");
};
export default mongoose.model<IMessageDocument, IMessageModel>("Message", messageSchema);
//module.exports = mongoose.model("Message", messageSchema);
