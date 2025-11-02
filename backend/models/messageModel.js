import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    messageType: {
        type: String,
        enum: ['text', 'file'],

    },
    content: {
        type: String,
        required: function () {
            return this.messageType === "text";
        }
    },
    fileUrl: {
        type: String,
        required: function () {
            return this.messageType === "file";
        }
    },
    fileName: {
        type: String,
        required: function () {
            return this.messageType === "file";
        }
    },
}, { timestamps: true })

const message = mongoose.model("Message", messageSchema);
export default message;