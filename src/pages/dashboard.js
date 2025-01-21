import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { getToken } from '../services/authServices';
import axiosInstance from '@/utils/axiosInstance';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  // Di Dashboard.js setelah mendapatkan data pengguna
useEffect(() => {
  const fetchUserData = async () => {
    const token = getToken();
    if (token) {
      try {
        const response = await axiosInstance.get('api/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);

        // Menyimpan username dan role di localStorage
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('role', response.data.role);
      } catch (err) {
        setError('Failed to fetch user data');
        console.error(err);
      }
    } else {
      setError('No token found');
    }
  };

  fetchUserData();
}, []);

  return (
    <>
      {userData && <Header username={userData.username} role={userData.role} />}
      <div className="container mt-5">
        <h2>Dashboard</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {userData ? (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Welcome, {userData.username}</h5>
              <p className="card-text">Role: {userData.role}</p>
            </div>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </>
  );
};

export default Dashboard;
