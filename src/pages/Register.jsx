import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import api from '../utils/api';

const Register = () => {
  const navigate = useNavigate(); // 2. Initialize navigate
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setStatus({ type: '', message: '' });

  try {
    // 1. Register (Sends JSON)
    await api.post('/auth/register', formData);
    console.log("Registration successful");

    // 2. Login (FastAPI usually requires URLSearchParams for the login form)
    const loginData = new URLSearchParams();
    loginData.append('username', formData.username);
    loginData.append('password', formData.password);

    const loginResponse = await api.post('/auth/token', loginData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log("Login Response:", loginResponse.data);

    // 3. Store Token (Check if your backend returns 'access_token' or just 'token')
    const token = loginResponse.data.access_token || loginResponse.data.token;
    
    if (token) {
      localStorage.setItem('token', token);
      setStatus({ type: 'success', message: 'Success! Redirecting...' });
      
      // 4. Redirect
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      throw new Error("Token not found in response");
    }

  } catch (error) {
    console.error("Error details:", error.response?.data);
    
    let errorMsg = 'Process failed';
    const detail = error.response?.data?.detail;

    if (Array.isArray(detail)) {
      errorMsg = detail[0].msg;
    } else if (typeof detail === 'string') {
      errorMsg = detail;
    }

    setStatus({ type: 'error', message: errorMsg });
  } finally {
    setLoading(false);
  }
};

  return (
    // ... UI remains the same ...
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-md border-2 border-gray-800 p-8 rounded-lg">
        <h2 className="text-2xl font-black text-black mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-black mb-1">Username</label>
            <input name="username" type="text" required className="w-full border-2 border-gray-400 p-2 text-black focus:border-blue-600 outline-none" value={formData.username} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-1">Email Address</label>
            <input name="email" type="email" required className="w-full border-2 border-gray-400 p-2 text-black focus:border-blue-600 outline-none" value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-1">Password</label>
            <input name="password" type="password" required className="w-full border-2 border-gray-400 p-2 text-black focus:border-blue-600 outline-none" value={formData.password} onChange={handleChange} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-black py-3 text-white font-bold hover:bg-gray-800 disabled:bg-gray-400">
            {loading ? 'Processing...' : 'Register'}
          </button>
        </form>
        {status.message && (
          <div className={`mt-4 p-3 border-2 font-bold ${status.type === 'success' ? 'border-green-600 text-green-600' : 'border-red-600 text-red-600'}`}>
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;