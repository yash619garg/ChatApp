import { myError } from "../config/error.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs"
import { asyncHandler } from "../utils/AsyncHandler.js";
import { createToken } from "../utils/createToken.js";
import { getDataUri } from "../utils/getDataUri.js";
import cloudinary from "cloudinary";

export const register = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        console.log("hello");
        throw new myError("Please provide all inputs", 400);
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        throw new myError("user with the email already exist", 400)
    }
    const newUser = new User({ email: email, password: password });
    await newUser.save();
    const userID = newUser._id;
    const token = await createToken(userID, res);
    res.status(201).json({ message: "User registered successfully", data: { email, userID, profileSetup: newUser.profileSetup, password: newUser.password } });

})

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new myError("please provide all inputs", 400);
    }
    const user = await User.findOne({ email: email });
    if (!user) {
        throw new myError("user not found", 404);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new myError("password mismatch", 400);
    }
    const userID = user._id;
    const token = await createToken(userID, res);
    res.status(200).json({ message: "User logged in successfully", data: { email, userID, profileSetup: user.profileSetup, password: user.password } });

})

export const logout = asyncHandler(async (req, res) => {
    res.cookie("jwt", ' ', {
        httpOnly: true,
        expires: new Date(0)
    })
    res.cookie("connect.sid", "", {
        httpOnly: true,
        expires: new Date(0),
    })
    res.status(201).json({ message: "logged out successfully" });
})

export const getUserDetails = asyncHandler(async (req, res) => {
    const userID = req.user._id;
    const user = await User.findById(userID);
    if (!user) {
        throw new myError("user not found", 404);
    }
    res.status(200).json({ user });
})

export const updateProfile = asyncHandler(async (req, res) => {
    const { firstName, lastName, image, email, password } = req.body;
    if (!firstName || !lastName || !email) {
        throw new myError("please provide all the inputs", 400);
    }
    // "$2a$10$hl8wvb5WE7ovlJZRA.8s0.ZQIZX9xu2itVdKw0fd.ZzLwzJOFOyti"
    const userID = req.user._id;
    let updatedUser = null;
    if (password) {
        updatedUser = await User.findByIdAndUpdate(userID, { firstName, lastName, image, profileSetup: true, email, password }, { new: true })
        await updatedUser.save();
    }
    else {
        updatedUser = await User.findByIdAndUpdate(userID, { firstName, lastName, image, profileSetup: true, email }, { new: true })

    }
    res.status(200).json({ message: "profile updated successfully", data: updatedUser });

})

export const removeProfile = asyncHandler(async (req, res) => {

    const userID = req.user._id;
    const updatedUser = await User.findByIdAndUpdate(userID, { image: null }, { new: true })
    console.log(updatedUser);
    res.status(200).json({ message: "profile updated successfully", data: updatedUser });

})

export const updateProfileImage = asyncHandler(async (req, res) => {
    // const data = req.body;
    const file = req.file;
    console.log(file);
    const fileUri = getDataUri(file);
    const chatProfile = await cloudinary.v2.uploader.upload(fileUri.content);

    res.status(200).json({ url: chatProfile.secure_url, public_id: chatProfile.public_id });
})