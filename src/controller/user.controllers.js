import { user} from "../models/user.models.js";
import { Apierror } from "../utils/Apierror.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { asynchandler } from "../utils/AsyncHandler.js";
import { uploadcloudinary } from "../utils/Cloudinary.js";


const AccessandRefreshToken =async(userId)=>{
    const loginuser = await user.findById(userId)
    const accessToken = loginuser.AccessTokenGenerate()
     const refreshToken = loginuser.RefreshTokenGenerate()
     loginuser.refreshtoken = refreshToken
     await loginuser.save({validateBeforeSave:false})
     return ({accessToken,refreshToken})

}
const registeruser = asynchandler(async(req,res)=>{
    const{fullname,email,phone,password}=req.body

    if(!fullname || !email ||!phone  ||!password){
        throw new Apierror(400,"please fill all required fields");
    }

    const existeduser = await user.findOne({
        $or:[{email},{fullname}]
    })

    if(existeduser){
        throw new Apierror(400,"user already exists");
    }

    const imagepath = req.files?.image?.[0]?.path;

     if(!imagepath){
        throw new Apierror(400,"File not found");
    }

    const imageurl = await uploadcloudinary(imagepath)
 
     if(!imageurl){
        throw new Apierror(400,"Image not uploaded");
    }

    const registereduser = await user.create({
        fullname,
        email,
        phone,
        password,
        image:imageurl.url
    })

    const registeruser = await user.findById(registereduser._id).select("-password" )

    return res.status(201)
    .json(new Apiresponse(200,"User  created successfully",registeruser))

    

})

const loginuser = asynchandler(async(req,res)=>{
    const{email,password}=req.body 

    if(!email || !password){
        throw new Apierror(400,"User do not exists")
    }
    
    const loginneduser = await user.findOne({email});

    if(!loginneduser){
        throw new Apierror(300,"User not found in database")
    }

    const correctpassword = await loginneduser.isPasswordCorrect(password)

    if(!correctpassword){
        throw new Apierror(300,"Password incorrect")
    }

    const {accessToken:accessToken , refreshToken:refreshToken} = await AccessandRefreshToken(loginneduser._id);

    const saveduser =await user.findById(loginneduser._id).select("-password -refreshToken")

    if(!saveduser){
        throw new Apierror(400,"something went wrong");
    }

   const options = {
  httpOnly: true,
  secure: true,     // ✅ False for localhost (no HTTPS)
  sameSite: "None"    // "lax" is fine for basic CSRF protection
}

    return res.status(201)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new Apiresponse(201,"User logged in successfully" ,saveduser))

})

const getallusers = asynchandler(async(req,res)=>{
    const alluser = await user.find()
    if(!alluser){
        throw new Apierror(400,"User not fetched successfully")
    }

    return res.status(200)
    .json(new Apiresponse(200,"user fetched successfully",alluser))

})



const logoutuser = asynchandler(async(req,res)=>{
    const logoutuser = await user.findByIdAndUpdate(req.user?._id,
        {
            $set:{refreshtoken:undefined}
        },
        {
            new:true
        }
    )

    const options = {
  httpOnly: true,
  secure: true,     // ✅ False for localhost (no HTTPS)
  sameSite:"None"    // "lax" is fine for basic CSRF protection
}
   return  res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new Apiresponse(200,"User loggedout successfully",{}))
 


})

export {registeruser , loginuser, logoutuser,getallusers }