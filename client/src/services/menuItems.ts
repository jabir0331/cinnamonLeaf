// client/src/services/menuItems.ts
import axios from "axios";
import { apiErrorData, apiErrorStatus } from "../utils/errors";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getAllMenuItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/menu/viewAll`);
    return response.data;
  } catch (err) {
    console.error("Error fetching menu items:", err);
    console.error("Error response:", apiErrorData(err));
    console.error("Error status:", apiErrorStatus(err));
    throw err;
  }
};


export const createMenuItem = async (formData: FormData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/menu/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    console.error("Error creating menu item:", err);
    console.error("Error response:", apiErrorData(err));
    throw err;
  }
};

export const updateMenuItem = async (id: string, formData: FormData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/menu/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    console.error("Error updating menu item:", err);
    console.error("Error response:", apiErrorData(err));
    throw err;
  }
};

// In menuItems.ts, add this function
export const toggleMenuItemStatus = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.patch(`${API_URL}/menu/toggle-status/${id}`, null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (err) {
    console.error("Error toggling menu item status:", err);
    console.error("Error response:", apiErrorData(err));
    throw err;
  }
};