// client/src/services/menuItems.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// client/src/services/menuItems.ts
export const getAllMenuItems = async () => {
  try {
    console.log('Fetching from:', `${API_URL}/menu/viewAll`);
    const response = await axios.get(`${API_URL}/menu/viewAll`);
    console.log('API Response:', response.data);
    return response.data;
  } catch (err: any) {
    console.error("Error fetching menu items:", err);
    console.error("Error response:", err.response?.data);
    console.error("Error status:", err.response?.status);
    throw err;
  }
};