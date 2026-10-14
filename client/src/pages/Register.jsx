import React, { useState } from 'react';
import { User, BadgeCheck, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import AuthCard from '../components/common/AuthCard';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import { registerUserApi } from '../api/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    fullname: '',
    username: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }))
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (userDetails?.password !== userDetails?.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
      const { username, fullname, confirmPassword } = userDetails;
      const response = await registerUserApi({
        username, fullname, password: confirmPassword
      })
      console.log("Registration Response:", response);
      if (response?.status === 201) {
        toast.success(response?.data?.message);
        setUserDetails({
          fullname: '',
          username: '',
          password: '',
          confirmPassword: ''
        })
        navigate("/login");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  return (
    <AuthCard
      title="Create Account"
      subtitle="Join ChatPulse to start chatting in real time"
      footerPrompt="Already have an account?"
      footerLinkText="Sign in"
      footerLinkTo="/login"
    >
      <form onSubmit={handleSubmit}>
        <InputField
          label="Full Name"
          id="fullname"
          name="fullname"
          type="text"
          placeholder="Enter your full name"
          required
          icon={BadgeCheck}
          autoComplete="name"
          value={userDetails?.fullname}
          onChange={handleChange}
        />

        <InputField
          label="Username"
          id="username"
          name="username"
          type="text"
          placeholder="Enter your username"
          required
          icon={User}
          autoComplete="username"
          value={userDetails?.username}
          onChange={handleChange}
        />

        <InputField
          label="Password"
          id="password"
          name="password"
          type="password"
          placeholder="At least 6 characters"
          required
          icon={Lock}
          autoComplete="new-password"
          value={userDetails?.password}
          onChange={handleChange}
        />

        <InputField
          label="Confirm Password"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Re-type your password"
          required
          icon={ShieldCheck}
          autoComplete="new-password"
          value={userDetails?.confirmPassword}
          onChange={handleChange}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          icon={ArrowRight}
          className="mt-2"
        >
          Create Account
        </Button>
      </form>
    </AuthCard>
  );
};

export default Register;
