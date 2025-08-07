import dotenv from "dotenv";
import { connectdb } from "./db/dbconnect.js";
import { app } from "./app.js";

dotenv.config({
    path:"./env"
})

connectdb()
.then(()=>{
    app.on("error",()=>{
        console.log("error");
        throw error;
    })
    app.listen(process.env.PORT,()=>{
        console.log(`App is listening on port ${process.env.PORT}`)
    })
})

