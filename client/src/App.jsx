import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from "react-hot-toast";
import HomePage from './pages/HomePage';
import AuthContext from './context/AuthContext';
import PublicRoute from './routes/PublicRoute';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  const { isLoggedUser, loading } = useContext(AuthContext);
  // console.log("isLoggedUser", isLoggedUser);
  // console.log("loading", loading);
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Private Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;