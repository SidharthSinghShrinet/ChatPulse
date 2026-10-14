import React, { createContext, useContext, useEffect, useState } from 'react'
import { getLoggedInUserProfile, logoutUserApi } from '../api/api.js';


export const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await getLoggedInUserProfile();
                if (response?.status === 200) {
                    setUser(response?.data?.data);
                }
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const logout = async () => {
        try {
            await logoutUserApi();
        } finally {
            setUser(null);
        }
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout, isAuthenticated: !!user }
        }>
            {children}
        </AuthContext.Provider >
    )
}

export default AuthContext