import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <div className='min-h-screen bg-slate-950 flex items-center justify-center text-slate-400'>Loading...</div>
        )
    }
    return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute