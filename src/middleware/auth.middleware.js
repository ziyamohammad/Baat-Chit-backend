import jwt from "jsonwebtoken";
import { Apierror } from "../utils/Apierror.js";
import { user } from "../models/user.models.js";
import { asynchandler } from "../utils/AsyncHandler.js";

const verifyjwt = asynchandler(async (req, _, next) => {
  try {
  const token = req.cookies?.accessToken || req.headers?.authorization?.replace("Bearer ", "")


    if (!token) {
      throw new Apierror(401, "Access token missing");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded || !decoded._id) {
      throw new Apierror(403, "Invalid token");
    }

    const verifieduser = await user.findById(decoded._id);

    if (!verifieduser) {
      throw new Apierror(404, "User not found");
    }

    req.user = verifieduser;
    next();
  } catch (error) {
    throw new Apierror(500, "Something went wrong in verifying token");
  }
});

export { verifyjwt };
