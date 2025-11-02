import user from "../models/userModel.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import channel from "../models/channelModel.js";
import Message from "../models/messageModel.js";
import { myError } from "../config/error.js";

export const createChannel = asyncHandler(async (req, res) => {
    const { name, members } = req.body;
    const admin = await user.findById(req.user._id);
    if (!name) {
        throw new myError("please provide name", 400);
    }
    if (!admin) {
        throw new myError("admin not found", 404);
    }

    const validMembers = await user.find({ _id: { $in: members } })
    if (!validMembers < 0 || members.length !== validMembers.length) {
        throw new myError("some members are not valid members", 400);
    }
    const newChannel = new channel({
        members,
        admin: req.user._id,
        name,
    })
    await newChannel.save();
    res.status(201).json({ message: "channel created successfully", data: newChannel });

})

export const getChannelById = asyncHandler(async (req, res) => {
    const id = req.user._id;
    const channels = await channel.find({ $or: [{ admin: id }, { members: id }] }).sort({ updatedAt: -1 });
    return res.status(200).json(channels)
})

export const getChannelMessages = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const messages = await channel.findById(id).select("messages");
    console.log(messages);

    const allMessages = await Message.find({ _id: { $in: messages.messages } }).populate("sender")

    console.log(allMessages);

    return res.status(200).json(allMessages)
})