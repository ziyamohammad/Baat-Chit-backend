import { getallusers, holduser, loginuser, logoutuser, registeruser } from "../controller/user.controllers.js";
import { verifyjwt } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {Router} from "express" ;
import { user } from "../models/user.models.js";
import jewt from "jsonwebtoken";

const router =Router();

router.route("/register").post(upload.fields([
    {
    name:"image",
    maxCount:1
    }
]),registeruser)
router.route("/login").post(loginuser)
router.route("/logout").post(verifyjwt,logoutuser)
router.route("/fetchuser").post(getallusers)
router.route('/me').get(verifyjwt,holduser);

export {router}