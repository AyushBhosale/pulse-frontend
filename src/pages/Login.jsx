import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
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
      // FIX 1: Convert JSON to URLSearchParams for FastAPI OAuth2 compatibility
      const params = new URLSearchParams();
      params.append('username', formData.username);
      params.append('password', formData.password);

      const response = await api.post('/auth/token', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      
      setStatus({ type: 'success', message: 'Login successful! Redirecting...' });
      
      setTimeout(() => navigate('/'), 1500); 
      
    } catch (error) {
      // FIX 2: Safely parse error detail to avoid rendering objects in JSX
      let errorMsg = 'Invalid username or password';
      const detail = error.response?.data?.detail;

      if (typeof detail === 'string') {
        errorMsg = detail;
      } else if (Array.isArray(detail)) {
        // Extracts the "msg" field from FastAPI's validation array
        errorMsg = detail[0]?.msg || 'Validation Error';
      }

      setStatus({ 
        type: 'error', 
        message: String(errorMsg) 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-md border-2 border-gray-800 p-8 rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-2xl font-black text-black mb-6 uppercase tracking-tighter">Welcome Back</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-black mb-1 uppercase">Username</label>
            <input
              name="username"
              type="text"
              required
              className="w-full border-2 border-gray-800 p-2 text-black focus:bg-yellow-50 outline-none transition-colors"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-1 uppercase">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full border-2 border-gray-800 p-2 text-black focus:bg-yellow-50 outline-none transition-colors"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black py-3 text-white font-bold uppercase hover:bg-gray-800 disabled:bg-gray-400 transition-all active:translate-y-1"
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        {status.message && (
          <div className={`mt-4 p-3 border-2 font-bold ${
            status.type === 'success' ? 'border-green-600 text-green-600' : 'border-red-600 text-red-600'
          }`}>
            {status.message}
          </div>
        )}
        
        <p className="mt-6 text-sm font-bold text-gray-600">
          Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;