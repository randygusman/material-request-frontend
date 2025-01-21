import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Swal from 'sweetalert2';
import Loading from '../components/Loading'; // Import Loading Component
import axiosInstance from '@/utils/axiosInstance';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State untuk loading
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // disini tampilkan loading
    try {
      const response = await axiosInstance.post('api/auth/login', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username); // Menyimpan username
      localStorage.setItem('role', response.data.role); // Menyimpan role
    
      router.push('/dashboard');
    } catch (err) {
      setIsLoading(false); // Hide loading on error
      if (err.response && err.response.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'User not found or incorrect password!',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Something went wrong. Please try again later.',
        });
      }
    }
  };

  return (
    <>
      {isLoading && <Loading />} {/* Show loading overlay */}
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: '400px' }}>
          <h3 className="text-center mb-4">Login</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
