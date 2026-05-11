const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
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

messageSchema.statics.sendNewMessage = async function (data) {
  const Message = this;
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
    sender: senderId,
    receiver: receiverId,
    content: messageContent,
  });
  return await newMessage.save();
};

// Mesaj Geçmişini Getirmemiz
messageSchema.statics.getChatHistory = async function (myId, userId) {
    if (!mongoose.Types.ObjectId.isValid(myId) || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user IDs provided for chat history');
  }
  
  return await this.find({
    $or: [
      { sender: myId, receiver: userId },
      { sender: userId, receiver: myId },
    ],
  })
    .sort({ createdAt: 1 })
    .populate("sender", "username")
    .populate("receiver", "username");
};

module.exports = mongoose.model("Message", messageSchema);
