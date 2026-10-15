import { Server } from "socket.io"
import { instrument } from "@socket.io/admin-ui";
import messageModel from "../models/message.model.js";
import userModel from "../models/user.model.js";
import { corsOptions } from "../config/cors.js";


let io;

const userSocketMap = {};

export const getReceiverSocketIds = (receiverId) => {
    return userSocketMap[receiverId] ? Array.from(userSocketMap[receiverId]) : [];
}

export const initSocket = (server) => {
    io = new Server(server, {
        cors: corsOptions
    });

    instrument(io, {
        auth: false,
        mode: "development"
    })

    //! {"userId" : ["socketId1", "socketId2"]}

    io.on("connection", async (socket) => {
        const userId = socket?.handshake?.query?.userId;
        // console.log(`User connected with userid: ${userId} and socket id: ${socket.id}`);

        if (userId) {
            if (!userSocketMap[userId]) {
                userSocketMap[userId] = new Set();
            }
            // 1. First, add the new socket
            userSocketMap[userId].add(socket?.id);

            // 2. If size is exactly 1, this means this is the first tab the user has opened for the first time
            if (userSocketMap[userId].size === 1) {
                await userModel.findByIdAndUpdate(userId, {
                    isOnline: true
                });
                io.emit("userStatusUpdate", { userId, isOnline: true });

                // Mark all pending 'sent' messages as 'delievered'
                const undelieveredMessages = await messageModel.find({
                    receiverId: userId,
                    status: "sent"
                }).select("senderId");

                if (undelieveredMessages.length > 0) {
                    // Update in MongoDB
                    await messageModel.updateMany({
                        receiverId: userId,
                        status: "sent"
                    }, {
                        status: "delivered"
                    })

                    // Notify all unique senders (e.g. User A) that their messages are deilevered
                    const senderIds = [...new Set(undelieveredMessages.map(m => m.senderId.toString()))];
                    senderIds.forEach((uId) => {
                        const receiverSocketIds = getReceiverSocketIds(uId);
                        receiverSocketIds.forEach((sId) => {
                            io.to(sId).emit("messageDelivered", {
                                delieveredTo: userId,

                            })
                        })
                    })
                }
            }
        }

        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        // Detect Typing
        socket.on("typing", ({ receiverId }) => {
            const receiverSockets = getReceiverSocketIds(receiverId);
            receiverSockets.forEach((sId) => {
                io.to(sId).emit("userTyping", { senderId: userId })
            })
        })

        // Detect Stop Typing
        socket.on("stopTyping", ({ receiverId }) => {
            const receiverSockets = getReceiverSocketIds(receiverId);
            receiverSockets.forEach((sId) => {
                io.to(sId).emit("userStoppedTyping", { senderId: userId })
            })
        });

        // Listen when a user reads an incoming message live
        socket.on("markAsRead", async ({ conversationId, senderId }) => {
            await messageModel.updateMany({ conversationId, receiverId: userId, status: { $ne: "read" } }, { status: "read" })

            // Tell the original sender that their messages are seen
            const senderSockets = getReceiverSocketIds(senderId);
            senderSockets.forEach((sId) => {
                io.to(sId).emit("messageSeen", {
                    conversationId,
                    seenBy: userId
                })
            })

        })

        socket.on("disconnect", async () => {
            if (userId && userSocketMap[userId]) {
                userSocketMap[userId].delete(socket.id);
                console.log(`User disconnected with userid: ${userId} and socket id: ${socket.id}`);
                if (userSocketMap[userId].size === 0) {
                    delete userSocketMap[userId];
                    const lastSeenTime = new Date();
                    await userModel.findByIdAndUpdate(userId, {
                        isOnline: false,
                        lastSeen: lastSeenTime
                    })
                    io.emit("getOnlineUsers", Object.keys(userSocketMap));
                    io.emit("userStatusUpdate", {
                        userId,
                        isOnline: false,
                        lastSeen: lastSeenTime
                    })
                }
            }
        })
    })

};

export { io };