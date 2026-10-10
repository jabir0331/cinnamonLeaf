// client/src/services/order.ts
import axios from "axios";
import { describeError } from "../utils/errors";
import type { OrderPayload } from "../types/cart";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const saveOrder = async (orderData: OrderPayload) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");

    const response = await axios.post(`${API_URL}/orders/create`, orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } 
  catch (err) {
    console.error("Error saving order:", describeError(err));
    throw err;
  }
};

// Cancels the customer's own unpaid card order (payment setup failed or they backed out of Stripe)
export const cancelUnpaidOrder = async (orderNumber: string) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  await axios.put(`${API_URL}/orders/${encodeURIComponent(orderNumber)}/cancel`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// One of the signed-in customer's own orders, for the order confirmation page
export const getOrderByNumber = async (orderNumber: string) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No auth token found");

  const response = await axios.get(`${API_URL}/orders/${encodeURIComponent(orderNumber)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserOrders = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");

    const response = await axios.get(`${API_URL}/orders/myOrders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (err) {
    console.error("Error fetching user orders:", describeError(err));
    throw err;
  }
};

// Add this to your existing order.ts file
export const getOrders = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");

    const response = await axios.get(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (err) {
    console.error("Error fetching orders:", describeError(err));
    throw err;
  }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");

    const response = await axios.put(
      `${API_URL}/orders/${orderId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (err) {
    console.error("Error updating order status:", describeError(err));
    throw err;
  }
};