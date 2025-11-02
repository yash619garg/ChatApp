import { myError } from "../config/error.js";
import Message from "../models/messageModel.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { getDataUri } from "../utils/getDataUri.js";
import cloudinary from "cloudinary";

function isImage(fileName) {
    const imageRegex = /.*\.(jpg|jpeg|png|gif|bmp|tiff|webp|svg)$/i;
    return imageRegex.test(fileName);
}


export const getMessages = asyncHandler(async (req, res) => {
    const userId2 = req.params.id;
    const userId1 = req.user._id;
    if (!userId1 || !userId2) {
        throw new myError("Both id's are required", 400);
    }
    const messages = await Message.find({
        $or: [{
            sender: userId1, recipient: userId2
        },
        {
            sender: userId2, recipient: userId1
        }]
    })
    res.status(200).json({ messages });
})


export const sendFileMessage = asyncHandler(async (req, res) => {
    const file = req.file;
    console.log(file);

    const fileUri = getDataUri(file);

    if (isImage(file.originalname)) {
        const chatProfile = await cloudinary.v2.uploader.upload(fileUri.content, {
            resource_type: "image"
        }, function (error, result) {
            if (error) {
                console.error('Upload failed:', error);
            } else {
                console.log('Upload successful:', result);
            }
        });
        res.status(200).json({ url: chatProfile.secure_url, public_id: chatProfile.public_id, name: file.originalname });
    }

    else {

        const chatProfile = await cloudinary.v2.uploader.upload(fileUri.content, {
            resource_type: 'raw'
        }, function (error, result) {
            if (error) {
                console.error('Upload failed:', error);
            } else {
                console.log('Upload successful:', result);
            }
        });
        res.status(200).json({ url: chatProfile.secure_url, public_id: chatProfile.public_id, name: file.originalname });
    }
})