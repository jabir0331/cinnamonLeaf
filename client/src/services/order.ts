// client/src/services/order.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const saveOrder = async (orderData: any) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");

    const response = await axios.post(`${API_URL}/orders/create`, orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } 
  catch (err: any) {
    console.error("Error saving order:", err.response?.data || err.message);
    throw err;
  }
};

export const getUserOrders = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");

    const response = await axios.get(`${API_URL}/orders/myOrders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (err: any) {
    console.error("Error fetching user orders:", err.response?.data || err.message);
    throw err;
  }
};
