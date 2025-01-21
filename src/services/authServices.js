
import axiosInstance from '@/utils/axiosInstance';

export const login = async (username, password) => {
    try {
      const response = await axiosInstance.post('login', { username, password });
      console.log('Token received:', response.data.token); // Logging token yang diterima
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error.response?.data || error.message);
      throw error;
    }
  };


export const logout = () => {
  localStorage.removeItem('token');
};

export const getToken = () => {
    return localStorage.getItem('token');
};

  
