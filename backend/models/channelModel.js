import mongoose, { Mongoose } from "mongoose";

const channelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],

}, { timestamps: true })


const channel = mongoose.model('Channel', channelSchema)
export default channel