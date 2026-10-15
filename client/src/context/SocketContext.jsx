import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

export const SocketContext = createContext(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
}

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL.replace("/api/v1", "");

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { user } = useAuth();
    useEffect(() => {
        if (user) {
            const token = localStorage.getItem("token");
            const newSocket = io(SOCKET_URL, {
                withCredentials: true,
                auth: {
                    token
                },
                query: {
                    userId: user?._id,
                    token
                }
            })
            setSocket(newSocket);

            newSocket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            })

            return () => {
                newSocket.close();
                setSocket(null);
            }
        }
        else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [user]);
    return (
        <SocketContext.Provider value={{ socket, onlineUsers, setSocket, setOnlineUsers }}>
            {children}
        </SocketContext.Provider>
    )
}