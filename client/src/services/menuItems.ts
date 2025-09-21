// client/src/services/menuItems.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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


export const createMenuItem = async (formData: FormData) => {
  try {
    console.log('Creating menu item with form data');
    const response = await axios.post(`${API_URL}/menu/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('Create response:', response.data);
    return response.data;
  } catch (err: any) {
    console.error("Error creating menu item:", err);
    console.error("Error response:", err.response?.data);
    throw err;
  }
};

export const updateMenuItem = async (id: string, formData: FormData) => {
  try {
    console.log('Updating menu item with ID:', id);
    const response = await axios.put(`${API_URL}/menu/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('Update response:', response.data);
    return response.data;
  } catch (err: any) {
    console.error("Error updating menu item:", err);
    console.error("Error response:", err.response?.data);
    throw err;
  }
};

// In menuItems.ts, add this function
export const toggleMenuItemStatus = async (id: string) => {
  try {
    console.log('Toggling status for menu item with ID:', id);
    const response = await axios.patch(`${API_URL}/menu/toggle-status/${id}`);
    console.log('Toggle status response:', response.data);
    return response.data;
  } catch (err: any) {
    console.error("Error toggling menu item status:", err);
    console.error("Error response:", err.response?.data);
    throw err;
  }
};