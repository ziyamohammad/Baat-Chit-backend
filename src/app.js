import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import {Server} from "socket.io";

const app = express();
app.use(cors({
    origin:"https://baat-chit-frontend-rho.vercel.app",
    credentials:true
}))

const server = http.createServer(app)

const io = new Server(server,{
    cors:{
         origin:"https://baat-chit-frontend-rho.vercel.app",
         credentials:true
    }
})
//online user 
const onlineuser = new Set()
// socket connection

io.on("connection",async(socket)=>{
    console.log("Connected user",socket.id)
    const id =socket.handshake.auth.id
   
    const socketuser = await user.findById(id)
   
    socket.join(id)
    onlineuser.add(id)
    // console.log("user",socketuser)
    
   //last messages
   const allmessages = await Message.find({
    $or:[  { id: id },           // where this user is the sender
           { receiverId: id }   
        ]
   })
  //  console.log(allmessages)
   
   // Group by conversationId
const groupedMessages = allmessages.reduce((groups, message) => {
  const convId = message.conversationId.toString();
  if (!groups[convId]) {
    groups[convId] = [];
  }
  groups[convId].push(message);
  return groups;
}, {});

console.log(groupedMessages)
socket.emit("allgroupedconversation",groupedMessages)
    //online user details to clientside
    io.emit("onlineuser",Array.from(onlineuser))

    socket.emit("message-user",socketuser)

    //recievers id
    socket.on("reciever-id",async(data)=>{
        console.log("recievers-id is",data)
        const reciever = await user.findById(data)
        console.log("reciever is",reciever.fullname)
    })
     
//chat history fetching functionality\

   socket.on("selectReceiver", async ({ id, receiverId }) => {
    try {
        const messages = await Message.find({
            $or: [
                { id: id, receiverId: receiverId },
                { id: receiverId, receiverId: id }
            ]
        }).sort({ createdAt: 1 }); // oldest to newest
        // console.log(messages)
        socket.emit("messagehistory", messages);
    } catch (error) {
        console.error("Error fetching message history:", error);
    }
});
     


    socket.on("send-message", async ({ text, receiverId }) => {
    try {
      // 1. Find or create conversation
      let conversation = await Conversation.findOne({
        participants: { $all: [id, receiverId] }
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [id, receiverId]
        });
      }

      // 2. Save message
      const message = await Message.create({
        conversationId: conversation._id,
        id,
        receiverId,
        text
      });

      // 3. Update last message
      conversation.lastMessage = text;
      await conversation.save({validateBeforeSave:false});

      // 4. Send message to both sender & receiver
      io.to(id).emit("new-message", message);
      io.to(receiverId).emit("new-message", message);

    } catch (err) {
      console.error("Error sending message:", err);
    }
  });
    

    

    // disconnection
    socket.on("disconnect",()=>{
        onlineuser.delete(id)
        console.log("socket disconnected",socket.id)
    })
})

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser());

import {router} from "./routes/user.routes.js"
import { user } from "./models/user.models.js";
import { Conversation, Message } from "./models/Conversation.models.js";
app.use("/api/v1/user",router)
export {app,server};