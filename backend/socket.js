// import { disconnect } from "mongoose";
import { Server, Socket } from "socket.io";
import Message from "./models/messageModel.js"
import Channel from "./models/channelModel.js";

const setupSocket = (server) => {
    console.log("socket is working");

    const io = new Server(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["POST", "GET"],
            credentials: true,
        }
    })

    const disconnect = (socket) => {
        console.log(`client disconnected : ${socket.id}`);
        for (const [userID, socketID] of userSocketMap.entries()) {
            if (socketID === socket.id) {
                userSocketMap.delete(userID);
                break;
            }
        }
    }

    const sendMessage = async (message) => {
        console.log("Send message handler backend");

        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);

        const createMessage = await Message.create(message);
        const messageData = await Message.findById(createMessage._id).populate("sender", "_id email firstName lastName image").populate("recipient", "_id email firstName lastName image");

        if (recipientSocketId) {
            io.to(recipientSocketId).emit("receiveMessage", messageData);
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("receiveMessage", messageData);
        }

    }


    const sendChannelMessage = async (message) => {
        console.log("Send channel message handler backend");
        const { sender, content, channel_id, fileUrl, fileName, messageType } = message;
        const createdMessage = await Message.create({
            sender,
            content,
            recipient: null,
            messageType,
            fileUrl,
            fileName,
        })
        const messageData = await Message.findById(createdMessage._id).populate("sender", "_id email firstName lastName image").exec();

        await Channel.findByIdAndUpdate(channel_id, { $push: { messages: createdMessage._id } })
        const channel = await Channel.findById(channel_id).populate("members");

        const finalData = { ...messageData._doc, channelId: channel._id }
        console.log(finalData);


        if (channel && channel.members) {
            channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString())
                if (memberSocketId) {
                    io.to(memberSocketId).emit('receiveChannelMessage', finalData)
                }
            })
            const adminSocketId = userSocketMap.get(channel.admin.toString())
            if (adminSocketId) {
                io.to(adminSocketId).emit('receiveChannelMessage', finalData);
            }
        }
    }

    const userSocketMap = new Map();
    io.on("connection", (socket) => {

        const userID = socket.handshake.query.userID;
        if (userID) {
            userSocketMap.set(userID, socket.id);
            console.log(userSocketMap);
            console.log(`User connected : ${userID} with socket id : ${socket.id}`);
        }
        else {
            console.log("user id not provided during connection");
        }

        socket.on("sendMessage", sendMessage);
        socket.on("sendChannelMessage", sendChannelMessage);
        socket.on("disconnect", () => disconnect(socket))
    })


}

export default setupSocket;