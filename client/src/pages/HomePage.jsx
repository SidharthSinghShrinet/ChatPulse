import React, { useRef, useState } from 'react';
import Sidebar from '../components/chat/Sidebar';
import ChatContainer from '../components/chat/ChatContainer';
import NoChatSelected from '../components/chat/NoChatSelected';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';
import { getAllUsersWithMetadataApi, getMessagesApi, sendMessageApi } from '../api/api';
import { useEffect } from 'react';

function HomePage() {
    const { user, logout } = useAuth();
    const { socket, onlineUsers } = useSocket();

    // Pure UI state placeholders (You can replace/wire with your API data)
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);

    //All users
    const [users, setUsers] = useState([]);

    // Sample contacts (Replace with your actual users from GET /api/v1/users/all)
    useEffect(() => {
        async function getAllUsers() {
            try {
                const response = await getAllUsersWithMetadataApi();
                console.log(response)
                if (response?.status === 200) {
                    setUsers(response?.data?.data);
                }
            } catch (error) {

                toast.error(error?.response?.data?.message || error?.message);
            }
        }
        getAllUsers();
    }, []);

    // All Messages between LoggedInUser and Selected User
    const [messages, setMessages] = useState([]);

    // Sample messages (Replace with your actual messages from GET /api/v1/messages/:id)
    useEffect(() => {
        async function getMessages() {
            if (!selectedUser) return;
            setMessages([]);
            try {
                const response = await getMessagesApi(selectedUser?._id);
                if (response?.status === 200) {
                    setMessages(response?.data?.data);
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || error?.message)
            }
        }
        getMessages();
    }, [selectedUser]);


    // UI Handlers
    const handleSelectUser = (contact) => {
        setSelectedUser(contact);
        setIsTyping(false);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            // Reset unread counter for this contact to 0
            setUsers((prev) => prev.map((u) => (u?._id === contact?._id ? { ...u, unreadMessages: 0 } : u)));
        }
    };

    const handleBackToSidebar = () => {
        setSelectedUser(null);
        setIsTyping(false);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
    };

    // Handle typing debounce on input change
    const handleMessageInputChange = (e) => {
        const value = e.target.value;
        setMessageInput(value);

        if (!socket || !selectedUser) return;

        // Emit that logged-in user started typing
        socket.emit("typing", { receiverId: selectedUser._id });

        // Reset previous timer
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Emit stopTyping after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stopTyping", { receiverId: selectedUser._id });
        }, 2000);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedUser) return;

        // Stop typing immediately when message is submitted
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        if (socket && selectedUser) {
            socket.emit("stopTyping", { receiverId: selectedUser._id });
        }

        try {
            const response = await sendMessageApi(messageInput, selectedUser?._id);
            if (response?.status === 200 || response?.status === 201) {
                const sentMsg = response?.data?.data;
                setMessages((prev) => [...prev, sentMsg]);
                setMessageInput("");

                // Update lastMessage and move contact to top of sidebar
                setUsers((prev) => {
                    return prev
                        .map((u) => (u._id === selectedUser._id ? { ...u, lastMessage: sentMsg } : u))
                        .sort((a, b) => {
                            const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
                            const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
                            return timeB - timeA;
                        });
                });
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
        }
    };

    // Listen for Incoming Messages, Read Receipts & Live Typing in real-time
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (incomingMessage) => {
            const isChatOpen = selectedUser && selectedUser._id === incomingMessage.senderId;

            if (isChatOpen) {
                setMessages((prev) => [...prev, incomingMessage]);

                // Tell server to mark this message as read immediately after receiving it
                socket.emit("markAsRead", {
                    conversationId: incomingMessage.conversationId,
                    senderId: incomingMessage.senderId,
                });
            }

            // Update lastMessage and unreadCount in sidebar
            setUsers((prevUsers) => {
                return prevUsers
                    .map((u) => {
                        if (u._id === incomingMessage.senderId) {
                            return {
                                ...u,
                                lastMessage: incomingMessage,
                                unreadCount: isChatOpen ? 0 : (u.unreadCount || 0) + 1,
                            };
                        }
                        return u;
                    })
                    .sort((a, b) => {
                        const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
                        const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
                        return timeB - timeA;
                    });
            });
        };

        const handleUserTyping = ({ senderId }) => {
            if (selectedUser && selectedUser._id === senderId) {
                setIsTyping(true);
            }
        };

        const handleUserStoppedTyping = ({ senderId }) => {
            if (selectedUser && selectedUser._id === senderId) {
                setIsTyping(false);
            }
        };

        // When other user opens your chat, turn your sent message ticks to 'read' (blue ticks)
        const handleMessageSeen = ({ seenBy }) => {
            if (selectedUser && selectedUser._id === seenBy) {
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.senderId === user?._id ? { ...msg, status: "read" } : msg
                    )
                );
            }
        };

        // When Receipient Connects to the Internet, turn your 'sent' ticks(1 ) into 'delivered'(2)
        const handleMessageDelievered = ({ delieveredTo }) => {
            if (selectedUser && selectedUser?._id === delieveredTo) {
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.senderId === user?._id && msg.status === "sent" ? { ...msg, status: "delivered" } : msg
                    )
                );
            }
        };

        // Listen for when someone goes online or offline in real-time
        const handleUserStatusUpdate = ({ userId, isOnline, lastSeen }) => {
            // 1. Update the chat window if you are currently chatting with this user
            setSelectedUser((prev) => {
                if (prev && prev._id === userId) {
                    return { ...prev, isOnline, lastSeen };
                }
                return prev;
            });
            // 2. Update the contact in the sidebar list
            setUsers((prevUsers) =>
                prevUsers.map((u) =>
                    u._id === userId ? { ...u, isOnline, lastSeen } : u
                )
            );
        };

        socket.on("newMessage", handleNewMessage);
        socket.on("userTyping", handleUserTyping);
        socket.on("userStoppedTyping", handleUserStoppedTyping);
        socket.on("messageSeen", handleMessageSeen);
        socket.on("userStatusUpdate", handleUserStatusUpdate);
        socket.on("messageDelivered", handleMessageDelievered)

        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("userTyping", handleUserTyping);
            socket.off("userStoppedTyping", handleUserStoppedTyping);
            socket.off("messageSeen", handleMessageSeen);
            socket.off("userStatusUpdate", handleUserStatusUpdate);
            socket.off("messageDelivered", handleMessageDelievered)
        };
    }, [socket, selectedUser, user?._id]);

    const filteredUsers = users.filter((u) => u?.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) || u?.username?.toLowerCase().includes(searchQuery.toLowerCase()))

    return (
        <div className="h-[100dvh] w-screen flex bg-slate-50 dark:bg-slate-950 overflow-hidden select-none transition-colors duration-200">
            {/* Background Ambient Glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-fuchsia-600/5 dark:bg-fuchsia-600/10 rounded-full blur-3xl" />
            </div>

            {/* Main Chat Layout */}
            <div className="relative z-10 w-full h-full flex overflow-hidden">
                {/* Left Sidebar: Visible on desktop, or on mobile when no chat is open */}
                <div className={`h-full ${selectedUser ? 'hidden md:flex' : 'flex w-full md:w-auto'}`}>
                    <Sidebar
                        currentUser={user}
                        users={filteredUsers}
                        selectedUser={selectedUser}
                        onSelectUser={handleSelectUser}
                        onlineUsers={onlineUsers || []}
                        searchQuery={searchQuery}
                        onSearchChange={(e) => setSearchQuery(e.target.value)}
                        onLogout={logout}
                    />
                </div>

                {/* Right Area: Chat Window or Empty State */}
                <div className={`flex-1 h-full ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
                    {selectedUser ? (
                        <ChatContainer
                            selectedUser={selectedUser}
                            currentUser={user}
                            isOnline={onlineUsers?.includes(selectedUser?._id)}
                            isTyping={isTyping}
                            messages={messages}
                            messageText={messageInput}
                            onMessageChange={handleMessageInputChange}
                            onSendMessage={handleSendMessage}
                            onBack={handleBackToSidebar}
                        />
                    ) : (
                        <NoChatSelected />
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomePage;