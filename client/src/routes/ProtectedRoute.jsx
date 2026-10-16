import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <div className='min-h-screen bg-slate-950 flex items-center justify-center'>
                <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            </div>
        )
    }
    return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute