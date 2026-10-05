// client/src/services/auth.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const signupUser = async (formData: { name: string; email: string; phone: string; password: string }) => {
  const response = await axios.post(`${API_URL}/auth/signup`, formData);
  return response.data;
};

export const loginUser = async (formData: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/auth/login`, formData);
  return response.data;
};

export const googleAuth = async (credential: string) => {
  const response = await axios.post(`${API_URL}/auth/google`, { credential });
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

export const getCurrentUser = async (token: string) => {
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.user as { id: string; name: string; email: string; phone: string; role: string };
};
