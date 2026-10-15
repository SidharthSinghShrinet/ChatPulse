import React, { useState } from 'react';
import { User, Lock, ArrowRight } from 'lucide-react';
import AuthCard from '../components/common/AuthCard';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import { loginUserApi } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [loginDetails, setLoginDetails] = useState({
    username: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { username, password } = loginDetails;
      if (!username || !password) {
        throw new Error("Please fill all the fields!");
      }
      const response = await loginUserApi(loginDetails);
      if (response?.status === 200) {
        const token = response?.data?.meta?.token || response?.data?.data?.token;
        if (token) {
          localStorage.setItem("token", token);
        }
        toast.success(response?.data?.message);
        setUser(response?.data?.data)
        setLoginDetails({
          username: '',
          password: ''
        })
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  }

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Log in to resume your conversations in real time"
      footerPrompt="Don't have an account?"
      footerLinkText="Create an account"
      footerLinkTo="/register"
    >
      <form onSubmit={handleSubmit}>
        <InputField
          label="Username"
          id="username"
          name="username"
          type="text"
          placeholder="e.g. tushar_dev"
          required
          icon={User}
          autoComplete="username"
          value={loginDetails?.username}
          onChange={handleChange}
        />

        <InputField
          label="Password"
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          icon={Lock}
          autoComplete="current-password"
          value={loginDetails?.password}
          onChange={handleChange}
        />

        <div className="flex items-center justify-between mb-6 text-xs text-slate-400">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span>Remember me</span>
          </label>
          <a
            href="#forgot"
            className="hover:text-indigo-400 transition-colors"
          >
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          icon={ArrowRight}
        >
          Log In
        </Button>
      </form>
    </AuthCard>
  );
};

export default Login;
