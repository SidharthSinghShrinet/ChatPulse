import React, { useContext, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from "react-hot-toast";
import HomePage from './pages/HomePage';
import AuthContext from './context/AuthContext';
import PublicRoute from './routes/PublicRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import SplashScreen from './components/common/SplashScreen';

function App() {
  const { isLoggedUser, loading } = useContext(AuthContext);
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && (
        <SplashScreen isReady={!loading} onComplete={() => setShowSplash(false)} />
      )}
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