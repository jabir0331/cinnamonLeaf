// client/src/services/auth.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const signupUser = async (formData: any) => {
  const response = await axios.post(`${API_URL}/auth/signup`, formData);
  return response.data;
};

export const loginUser = async (formData: any) => {
  const response = await axios.post(`${API_URL}/auth/login`, formData);
  return response.data;
};

export const logoutUser = async (token: string) => {
  const response = await axios.post(
    `${API_URL}/auth/logout`,
    {}, // no body
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};