import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash, FaMoon, FaSun } from 'react-icons/fa';
import loginIllustration from '../../assets/login-illustration.png';
//import loginLogo from '../images/login-logo.png';     
import logo from '../../assets/logo.png';

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Check if staff is already logged in
    const staffId = sessionStorage.getItem('id');
    if (staffId) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('/api/login', {
        username: formData.email,
        password: formData.password
      });
      
      if (response.data.success) {
        const staff = response.data.results[0];
        sessionStorage.setItem('id', staff.id);
        sessionStorage.setItem('fName', staff.f_name);
        sessionStorage.setItem('lName', staff.l_name);
        sessionStorage.setItem('email', staff.email);
        sessionStorage.setItem('permissions', JSON.stringify(staff.permissions));
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (!err.response) {
        setError('Server is not running. Please start the server.');
      } else {
        setError(err.response.data.message || 'Invalid email or password');
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="relative w-2/5 flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300 p-10">
        <div 
          className="absolute top-5 left-5 p-3 rounded-full bg-purple-100 hover:bg-purple-200 cursor-pointer transition-all duration-300 flex items-center justify-center"
          onClick={toggleDarkMode}
        >
          {darkMode ? (
            <FaSun className="text-yellow-500 text-xl" />
          ) : (
            <FaMoon className="text-purple-600 text-xl" />
          )}
        </div>
        
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="logo" className="w-15 md:w-15 h-8 md:h-10" />
              <div className="py-6 text-xl md:text-2xl text-gray-800 dark:text-white">
                <span className="font-['Dancing_Script']">House of Sarang</span>
              </div>
            </Link>
          </div>
          
          {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-600 dark:text-gray-200 mb-2">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">✉️</span>
              </div>
            </div>

            <div>
              <label className="block text-gray-600 dark:text-gray-200 mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <span 
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-purple-600 hover:text-purple-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
      
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-purple-500 to-purple-600 items-center justify-center p-10">
        <img 
          src={loginIllustration} 
          alt="Login Illustration" 
          className="max-w-full h-auto max-h-[80vh] object-contain"
        />
      </div>
    </div>
  );
}

export default Login;