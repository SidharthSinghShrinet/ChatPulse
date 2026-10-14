import expressAsyncHandler from "express-async-handler";
import messageModel from "../models/message.model.js";
import conversationModel from "../models/conversation.model.js";
import ErrorHandler from "../utils/ErrorHandler.util.js";
import ApiResponse from "../utils/ApiResponse.util.js";
import { getReceiverSocketIds, io } from "../socket/socket.js";

const sendMessage = expressAsyncHandler(async (req, res, next) => {
    const senderId = req.user._id;
    const receiverId = req.params.id;
    const { message } = req.body
    if (!message || !message.trim()) {
        throw new ErrorHandler(400, "Message content is required");
    }
    const sortedParticipants = [senderId.toString(), receiverId.toString()].sort();
    const conversation = await conversationModel.findOneAndUpdate(
        { participants: sortedParticipants },
        { $setOnInsert: { participants: sortedParticipants } },
        { upsert: true, new: true }
    );

    const receiverSocketIds = getReceiverSocketIds(receiverId);
    const initialStatus = receiverSocketIds.length > 0 ? "delivered" : "sent";

    const newMessage = await messageModel.create({
        senderId,
        receiverId,
        message: message.trim(),
        conversationId: conversation._id,
        status: initialStatus
    })
    if (!newMessage) {
        throw new ErrorHandler(400, "Failed to send message");
    }
    await conversationModel.findByIdAndUpdate(conversation._id, {
        lastMessage: newMessage._id
    })

    receiverSocketIds.forEach((socketId) => {
        io.to(socketId).emit("newMessage", newMessage);
    })
    new ApiResponse(201, true, "Message sent successfully", newMessage).send(res);
})

const getMessage = expressAsyncHandler(async (req, res, next) => {
    const senderId = req?.user?._id;
    const receiverId = req?.params?.id;
    const sortedParticipants = [senderId.toString(), receiverId.toString()].sort();
    const conversation = await conversationModel.findOne({
        participants: sortedParticipants
    });
    if (!conversation) {
        return new ApiResponse(200, true, "No conversation found", []).send(res);
    }
    const messages = await messageModel.find({ conversationId: conversation._id }).sort({ createdAt: 1 });

    // 1. Mark unread messages sent to me as 'read'
    await messageModel.updateMany({ conversationId: conversation._id, receiverId: senderId, status: { $ne: "read" } }, { status: "read" });

    // 2. Notify the other user (receiver) in real time that their messages were seen
    const otherUserSockets = getReceiverSocketIds(receiverId);
    otherUserSockets.forEach((sId) => {
        io.to(sId).emit("messageSeen", {
            conversationId: conversation._id,
            seenBy: senderId.toString()
        })
    })
    new ApiResponse(200, true, "Message fetched successfully", messages).send(res)
})

export { sendMessage, getMessage }