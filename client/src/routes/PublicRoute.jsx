import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = () => {
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
                Loading...
            </div>
        )
    }

    return (
        !user ? <Outlet /> : <Navigate to="/" replace />
    )
}

export default PublicRoute;