// client/src/services/promotions.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getAllPromotions = async () => {
  try {
    const response = await axios.get(`${API_URL}/promotions/viewAll`);
    return response.data;
  } catch (err: any) {
    console.error("Error fetching promotions:", err);
    throw err;
  }
};

export const createPromotion = async (formData: FormData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/promotions/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err: any) {
    console.error("Error creating promotion:", err);
    throw err;
  }
};

export const updatePromotion = async (id: string, formData: FormData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/promotions/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err: any) {
    console.error("Error updating promotion:", err);
    throw err;
  }
};

export const togglePromotionStatus = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.patch(`${API_URL}/promotions/toggle-status/${id}`, null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (err: any) {
    console.error("Error toggling promotion status:", err);
    throw err;
  }
};
