import mongoose from "mongoose";
import User from "../models/userModel.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import Message from "../models/messageModel.js";

export const searchContact = asyncHandler(async (req, res) => {
    const { searchTerm } = req.body;
    if (!searchTerm) {
        throw new Error("please provide search term", 400);
    }
    const regex = { $regex: searchTerm, $options: "i" }
    const contacts = await User.find({
        $and: [
            { _id: { $ne: req.user._id } },
            { profileSetup: { $ne: false } },
            { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] }
        ]
    })
    res.status(200).json(contacts);
})

export const getContactForDMList = asyncHandler(async (req, res) => {
    let userId = req.params.id;
    userId = new mongoose.Types.ObjectId(userId)

    //In Mongoose, the aggregate function is used to perform complex data transformations and calculations directly in MongoDB. It allows you to run aggregation pipelines, which consist of multiple stages to process and analyze your data, such as filtering, grouping, sorting, projecting, and more.


    const contacts = await Message.aggregate([
        {   // Match either the sender or recipient as the current user
            $match: {
                $or: [{ sender: userId }, { recipient: userId }]
            },
        }, {
            // Sort messages by creation time in descending order
            $sort: {
                createdAt: -1
            }
        },
        // Group by the other user in the conversation (either recipient or sender)
        {
            $group: {
                _id: {
                    $cond: {
                        if: { $eq: ["$sender", userId] },  // If sender is the current user
                        then: "$recipient",  // Group by recipient
                        else: "$sender"  // Otherwise group by sender
                    }
                },
                lastMessageTime: { $first: "$createdAt" }   // Get the last message time
            }
        },
        {
            // Lookup user information for the contact (other person in the chat)

            $lookup: {
                from: "users",  // Assuming the user's collection is "users"
                localField: "_id",  // _id is the contact's userId (from the group stage)
                foreignField: "_id", // Matching on the user's _id
                as: "contactInfo" // Store the matched user in an array called "contactInfo"
            }
        },
        {
            $unwind: "$contactInfo"  // Unwind the contactInfo array to get individual fields
        },
        // Project only the fields you want to return
        {
            $project: {
                _id: 1,
                lastMessageTime: 1,
                email: "$contactInfo.email",
                firstName: "$contactInfo.firstName",
                lastName: "$contactInfo.lastName",
                image: "$contactInfo.image",
            }
        },
        // Sort contacts by the last message time
        {
            $sort: { lastMessageTime: -1 }
        }

        // Visual Overview of the Process:
        // Filter: Match messages where the user is either the sender or recipient.
        // Sort: Sort the messages by creation date, with the newest first.
        // Group: Group messages by the other person in the conversation.
        // Pick Most Recent: For each group, pick the most recent message.
        // Lookup User Info: Fetch details of the other person from the users collection.
        // Unwind: Flatten the user info array to make it easier to access.
        // Project: Return the relevant fields(user info + last message time).
        // Sort: Finally, sort the list of conversations by the most recent message.

    ])
    res.status(200).json(contacts);
})


export const getAllContacts = asyncHandler(async (req, res) => {

    const users = await User.find({ _id: { $ne: req.user._id } }, "firstName lastName email _id");
    const contacts = users.map((user) => {
        return {
            label: user.email,
            value: user._id
        }
    })

    res.status(200).json(contacts);
})

