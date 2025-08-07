import mongoose from "mongoose"
import bcrypt from "bcrypt"
import { json } from "express";
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
   fullname:{
    type:String,
    required:true,
   },
  email:{
    type:String,
    required:true,
    trim:true,
    lowercase:true
  },
  phone:{
    type:String,
    required:true
  },
  password:{
   type:String,
   required:true
  },
  image:{
    type:String,
    required:true
  },
  refreshtoken:{
    type:String
  }
},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next();
    this.password = await bcrypt.hash(this.password,10)
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.AccessTokenGenerate = function(){
    return jwt.sign({
        _id:this.id,
        fullname:this.fullname,
        email:this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
    }
)
}

userSchema.methods.RefreshTokenGenerate = function(){
    return jwt.sign({
        _id:this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
    }
)
}

export const user = mongoose.model("user",userSchema);