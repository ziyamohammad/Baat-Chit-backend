import mongoose from "mongoose" ;

const messageSchema = new mongoose.Schema({
    text: { type: String },
    imageUrl: { type: String },
    videoUrl: { type: String },
    seen: { type: Boolean, default: false },
    msgByUserId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    }
}, { timestamps: true });

const conversationSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    messages: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Message'
        }
    ],
    lastMessage: {
        type: mongoose.Schema.ObjectId,
        ref: 'Message'
    }
}, { timestamps: true });

// Index for faster searches
conversationSchema.index({ participants: 1 });

export const MessageModel = mongoose.model('Message', messageSchema);
export const ConversationModel = mongoose.model('Conversation', conversationSchema);
