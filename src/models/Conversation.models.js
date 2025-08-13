import mongoose from "mongoose" ;

const messageSchema = new mongoose.Schema({
  conversationId: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: "Conversation", 
     required: true 
    },
  id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
},
  receiverId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
},
  text: { 
    type: String, 
    required: true
 },
}, { timestamps: true });


const conversationSchema = new mongoose.Schema({
  participants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
}],
  lastMessage: {
     type: String 
    },
}, { timestamps: true });

conversationSchema.index({ participants: 1 });

export const Message = mongoose.model('Message', messageSchema);
export const Conversation = mongoose.model('Conversation', conversationSchema);
