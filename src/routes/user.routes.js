import { getallusers, loginuser, logoutuser, registeruser } from "../controller/user.controllers.js";
import { verifyjwt } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {Router} from "express" ;

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


export {router}