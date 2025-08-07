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

    //online user details to clientside
    io.emit("onlineuser",Array.from(onlineuser))

    socket.emit("message-user",socketuser)

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
app.use("/api/v1/user",router)
export {app,server};