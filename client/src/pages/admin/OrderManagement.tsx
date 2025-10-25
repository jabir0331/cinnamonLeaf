import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { format, isToday, isYesterday, isThisWeek, isThisMonth, subMonths, isSameMonth, isThisYear } from "date-fns";
import { toast } from "react-toastify";
import { Search, Eye, X, Package, User, CreditCard, MapPin, Clock, Phone, Mail, FileText, Truck, BadgeCheck, UtensilsCrossed, PackageCheck } from 'lucide-react';
import { getOrders, updateOrderStatus } from '../../services/order';

const OrderManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('Today');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders(); // You'll create this function
      setOrders(response.orders || response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Prevent page scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = selectedOrder ? 'hidden' : 'auto';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-sage-green-600" />;
      case 'preparing':
        return <UtensilsCrossed size={16} className="text-sage-green-600" />;
      case 'out_for_delivery':
        return <Truck size={16} className="text-sage-green-600" />;
      case 'delivered':
        return <PackageCheck size={16} className="text-sage-green-600" />;
      case 'cancelled':
        return <X size={16} className="text-sage-green-600" />;
      default:
        return <Clock size={16} className="text-sage-green-600" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.deliveryInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
    const matchesDate = (dateFilter === 'Today' && isToday(orderDate)) ||
      (dateFilter === 'Yesterday' && isYesterday(orderDate)) ||
      (dateFilter === 'This Week' && isThisWeek(orderDate)) ||
      (dateFilter === 'This Month' && isThisMonth(orderDate)) ||
      (dateFilter === 'Last Month' && isSameMonth(orderDate, subMonths(new Date(), 1))) ||
      (dateFilter === 'This Year' && isThisYear(orderDate));
    return matchesSearch && matchesStatus && matchesDate;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">

      {/* Search and Filter */}
      <div className="p-2 mb-5 bg-warm-brown-100 rounded-xl">
        <div className="flex flex-col lg:flex-row gap-2">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-brown-400" />
              <input
                type="text"
                placeholder="Search by order number or item name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-cream-300 rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-sage-green-300 transition-colors bg-white"
              />
            </div>
          </div>

          {/* Date Filter */}
          <div className="lg:w-48">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 border border-cream-300 rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-sage-green-300 transition-colors bg-white"
            >
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="This Year">This Year</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="lg:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-cream-300 rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-sage-green-300 transition-colors bg-white"
            >
              <option value="All">All Status</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-warm-brown-100 overflow-hidden">

        {loading ? (
          <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-cream-50 via-warm-brown-50 to-sage-green-50">
            <div className="relative mb-8">
              <div className="w-16 h-16 border-4 border-warm-brown-200 border-t-warm-brown-600 rounded-full animate-spin shadow-lg"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-sage-green-400 rounded-full animate-spin animate-reverse" style={{ animationDuration: '1.5s' }}></div>
            </div>
            <div className="text-center">
              <p className="text-warm-brown-700 font-display text-2xl font-semibold">Loading your orders...</p>
              <p className="mt-2 text-warm-brown-500 font-body text-base">Retrieving order history, please wait a moment</p>
            </div>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">
            {error}
            <button
              onClick={fetchOrders}
              className="ml-4 bg-sage-green-500 text-white px-4 py-2 rounded-lg hover:bg-sage-green-600"
            >
              Retry
            </button>
          </div>
        ) : (

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-warm-brown-50">
                <tr>
                  <th className="text-left p-4 font-semibold text-warm-brown-800">Order</th>
                  <th className="text-left p-4 font-semibold text-warm-brown-800">Customer</th>
                  <th className="text-left p-4 font-semibold text-warm-brown-800">Payment Method</th>
                  <th className="text-left p-4 font-semibold text-warm-brown-800">Amount</th>
                  <th className="text-left p-4 font-semibold text-warm-brown-800">Payment Status</th>
                  <th className="text-left p-4 font-semibold text-warm-brown-800">Order Status</th>
                  <th className="text-left p-4 font-semibold text-warm-brown-800">Date</th>
                  <th className="text-left p-4 font-semibold text-warm-brown-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 bg-sage-green-100 rounded-full flex items-center justify-center">
                          <Package size={32} className="text-sage-green-600" />
                        </div>
                        <div className="text-center">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Orders Found</h3>
                          <p className="text-gray-600 max-w-xl">
                            There are no orders matching your current search and filter criteria. <br></br>Try adjusting your filters or search terms.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setStatusFilter('All');
                            setDateFilter('Today');
                          }}
                          className="px-6 py-2 bg-sage-green-500 text-white rounded-lg hover:bg-sage-green-600 transition-colors duration-200 font-medium"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="border-t border-warm-brown-100 hover:bg-warm-brown-25 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-800">{order.orderNumber}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-800">{order.deliveryInfo.name}</p>
                          <p className="text-sm text-gray-500">{order.deliveryInfo.phone}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-800">{order.paymentMethod.toUpperCase()}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-gray-800">LKR {order.totalAmount.toLocaleString()}</span>
                      </td>
                      <td className="p-4">
                        <div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus.toUpperCase()}
                          </span>

                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">{formatDate(order.createdAt)}</span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-5 animate-in fade-in duration-200" style={{ top: '-5rem', height: 'calc(100vh + 5rem)' }}>
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300 mt-7">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-warm-brown-50 via-cream-50 to-sage-green-50 px-8 py-6 border-b border-warm-brown-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-display font-bold text-warm-brown-800 mb-1">Order Details</h3>
                  <p className="text-sage-green-600 font-body">{selectedOrder.orderNumber}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="group p-3 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-2xl transition-all duration-200 hover:scale-110"
                >
                  <X size={24} className="group-hover:rotate-90 transition-transform duration-200" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto max-h-[calc(95vh-120px)]">
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Status and Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                  <div className="bg-gradient-to-br from-sage-green-50 to-sage-green-100 p-4 rounded-lg border border-sage-green-200">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(selectedOrder.orderStatus)}
                      <div>
                        <p className="text-sm text-sage-green-600 font-medium">Order Status</p>
                        <p className="text-lg font-semibold text-sage-green-800 capitalize">
                          {selectedOrder.orderStatus.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-warm-brown-50 to-warm-brown-200 p-4 rounded-lg border border-warm-brown-200">
                    <div className="flex items-center space-x-3">
                      <CreditCard size={16} className="text-cream-700" />
                      <div>
                        <p className="text-sm text-warm-brown-600 font-medium">Payment Method</p>
                        <p className="text-lg font-semibold text-warm-brown-800">
                          {selectedOrder.paymentMethod.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-sage-green-50 to-sage-green-100 p-4 rounded-lg border border-sage-green-200">
                    <div className="flex items-center space-x-3">
                      <BadgeCheck size={16} className="text-sage-green-600" />
                      <div>
                        <p className="text-sm text-sage-green-600 font-medium">Payment Status</p>
                        <p className="text-lg font-semibold text-sage-green-800 capitalize">
                          {selectedOrder.paymentStatus}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Order Information */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h4 className="text-lg font-display font-semibold text-warm-brown-800 mb-6">Order Information</h4>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-2 font-body">Order Number</label>
                        <div className="px-4 py-3 bg-warm-brown-50 border border-warm-brown-200 rounded-xl font-body">
                          {selectedOrder.orderNumber}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-2 font-body">Order Date</label>
                        <div className="px-4 py-3 bg-warm-brown-50 border border-warm-brown-200 rounded-xl font-body">
                          {format(selectedOrder.createdAt, "do MMM yyyy | hh:mm:ss a")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer & Delivery Information */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h4 className="text-lg font-display font-semibold text-warm-brown-800 mb-6">Customer & Delivery Information</h4>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-2 font-body">Customer Name</label>
                        <div className="px-4 py-3 bg-warm-brown-50 border border-warm-brown-200 rounded-xl font-body">
                          {selectedOrder.deliveryInfo.name}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-2 font-body">Phone Number</label>
                        <div className="px-4 py-3 bg-warm-brown-50 border border-warm-brown-200 rounded-xl font-body">
                          {selectedOrder.deliveryInfo.phone}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-2 font-body">Email Address</label>
                      <div className="px-4 py-3 bg-warm-brown-50 border border-warm-brown-200 rounded-xl font-body">
                        {selectedOrder.deliveryInfo.email}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-2 font-body">Delivery Address</label>
                      <div className="px-4 py-3 bg-warm-brown-50 border border-warm-brown-200 rounded-xl font-body">
                        {selectedOrder.deliveryInfo.address}
                      </div>
                    </div>
                    {selectedOrder.deliveryInfo.specialNotes && (
                      <div>
                        <label className="block text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-2 font-body">Special Notes</label>
                        <div className="px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl font-body">
                          {selectedOrder.deliveryInfo.specialNotes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h4 className="text-lg font-display font-semibold text-warm-brown-800 mb-6">Ordered Items</h4>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-warm-brown-50 rounded-xl">
                        <div className="flex-1">
                          <p className="font-medium text-warm-brown-900 font-body">{item.name}</p>
                          <div className="flex items-center space-x-4 text-sm text-warm-brown-600 mt-1 font-body">
                            <span>Unit Price: LKR {item.price.toLocaleString()}</span>
                            <span>•</span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-warm-brown-900 font-body">
                            LKR {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-warm-brown-200 mt-6 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-warm-brown-900 font-body">Total Amount</span>
                      <span className="font-bold text-lg text-sage-green-600 font-body">
                        LKR {selectedOrder.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Status Management */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h4 className="text-lg font-display font-semibold text-warm-brown-800 mb-6">Order Status Management</h4>
                  <div className="space-y-6">
                    {/* Current Status Display */}
                    <div className="bg-gradient-to-r from-sage-green-50 to-sage-green-100 p-4 rounded-xl border border-sage-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(selectedOrder.orderStatus)}
                          <div>
                            <p className="text-sm text-sage-green-600 font-medium">Current Status</p>
                            <p className="text-lg font-semibold text-sage-green-800 capitalize">
                              {selectedOrder.orderStatus.replaceAll('_', ' ')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-sage-green-600">Last updated</p>
                          <p className="text-sm font-medium text-sage-green-800">
                            {format(selectedOrder.updatedAt, "MMM dd, yyyy | hh:mm:ss a")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Update Form */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-2 font-body">Update Status</label>
                        <select
                          value={selectedOrder.orderStatus}
                          onChange={(e) => {
                            const updatedOrder = { ...selectedOrder, orderStatus: e.target.value };
                            setSelectedOrder(updatedOrder);
                          }}
                          className="w-full px-4 py-3 border border-warm-brown-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green-500 focus:border-transparent transition-all font-body bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <button
                        onClick={async () => {
                          try {
                            await updateOrderStatus(selectedOrder._id, selectedOrder.orderStatus);
                            // Refresh orders list
                            await fetchOrders();
                            setSelectedOrder(null);
                            toast.success(`Order status updated successfully`);
                          } catch (err) {
                            toast.error('Failed to update order status');
                            console.error('Error updating order status:', err);
                          }
                        }}
                        className="w-full bg-gradient-to-r from-sage-green-500 to-sage-green-600 text-white px-6 py-4 rounded-2xl hover:from-sage-green-600 hover:to-sage-green-700 transition-all duration-200 hover:scale-[1.02] shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Update Status
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;