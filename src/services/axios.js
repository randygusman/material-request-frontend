import axios from 'axios';
import { getToken } from '../services/authServices.js';

axios.interceptors.request.use((config) => {
  const token = getToken();
  console.log(token + ' ran');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
