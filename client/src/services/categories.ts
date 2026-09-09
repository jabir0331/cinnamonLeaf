// client/src/services/categories.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories/viewAll`);
    return response.data;
  } catch (err: any) {
    console.error("Error fetching categories:", err);
    throw err;
  }
};

export const createCategory = async (formData: FormData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/categories/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err: any) {
    console.error("Error creating category:", err);
    throw err;
  }
};

export const updateCategory = async (id: string, formData: FormData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/categories/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err: any) {
    console.error("Error updating category:", err);
    throw err;
  }
};

export const toggleCategoryStatus = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.patch(`${API_URL}/categories/toggle-status/${id}`, null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (err: any) {
    console.error("Error toggling category status:", err);
    throw err;
  }
};
