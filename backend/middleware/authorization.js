import { myError } from "../config/error.js";
import User from "../models/userModel.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";

export const authorization = asyncHandler(async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        throw new myError("user not authorized", 401);
    }

    const { userID } = jwt.decode(token, process.env.SECRET_KEY);
    const user = await User.findById({ _id: userID }).select("-password");
    req.user = user;
    next();

})