import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.options("*",cors({
    origin:"https://baat-chit-frontend-rho.vercel.app",
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser());

import {router} from "./routes/user.routes.js"
app.use("/api/v1/user",router)
export {app};