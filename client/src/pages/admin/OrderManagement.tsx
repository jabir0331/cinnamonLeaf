import React, { useState } from 'react';
import { Search, Eye } from 'lucide-react';

const OrderManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const orders = [
    {
      _id: '68a99e812e02fdab10a56e34',
      userId: '68a94936ad096cbc357f0d26',
      orderNumber: 'ORD-DEA032A8',
      items: [
        {
          id: 'mains-hyderabad-chicken-biriyani',
          name: 'Hyderabad Chicken Biriyani',
          price: 2250,
          quantity: 1,
          category: 'mains',
          image: '/images/menu/mainCourses/hyderabadChickenBiriyani.jpg'
        }
      ],
      deliveryInfo: {
        name: 'Soniya Gandhi',
        phone: '0756045410',
        email: 'kabirSingh@gmail.com',
        address: 'Jie Jie Beach Hotel, Beach Rd, Panadura, Sri Lanka',
        specialNotes: ''
      },
      totalAmount: 2250,
      paymentMethod: 'card',
      paymentStatus: 'paid',
      orderStatus: 'out_for_delivery',
      createdAt: '2025-08-23T10:57:05.027+00:00',
      updatedAt: '2025-08-23T10:57:05.062+00:00'
    },
    {
      _id: '68a99e812e02fdab10a56e35',
      userId: '68a94936ad096cbc357f0d27',
      orderNumber: 'ORD-BFC123D9',
      items: [
        {
          id: 'beverages-vanilla-milkshake',
          name: 'Vanilla Milkshake',
          price: 850,
          quantity: 2,
          category: 'beverages'
        }
      ],
      deliveryInfo: {
        name: 'Rajesh Kumar',
        phone: '+94701234567',
        email: 'rajesh.kumar@email.com',
        address: '123 Main Street, Colombo 03, Sri Lanka',
        specialNotes: 'Please call before delivery'
      },
      totalAmount: 1700,
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      orderStatus: 'preparing',
      createdAt: '2025-08-23T11:15:22.027+00:00',
      updatedAt: '2025-08-23T11:15:22.062+00:00'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.deliveryInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-warm-brown-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by order number or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-warm-brown-200 rounded-lg focus:outline-none focus:border-sage-green-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-warm-brown-200 rounded-lg focus:outline-none focus:border-sage-green-500"
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

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-warm-brown-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-warm-brown-50">
              <tr>
                <th className="text-left p-4 font-semibold text-warm-brown-800">Order</th>
                <th className="text-left p-4 font-semibold text-warm-brown-800">Customer</th>
                <th className="text-left p-4 font-semibold text-warm-brown-800">Items</th>
                <th className="text-left p-4 font-semibold text-warm-brown-800">Amount</th>
                <th className="text-left p-4 font-semibold text-warm-brown-800">Payment</th>
                <th className="text-left p-4 font-semibold text-warm-brown-800">Status</th>
                <th className="text-left p-4 font-semibold text-warm-brown-800">Date</th>
                <th className="text-left p-4 font-semibold text-warm-brown-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border-t border-warm-brown-100 hover:bg-warm-brown-25 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">#{order._id.slice(-8)}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-900">{order.deliveryInfo.name}</p>
                      <p className="text-sm text-gray-500">{order.deliveryInfo.phone}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm text-gray-900">{order.items.length} item(s)</p>
                      <p className="text-xs text-gray-500">{order.items[0]?.name}...</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-gray-900">LKR {order.totalAmount.toLocaleString()}</span>
                  </td>
                  <td className="p-4">
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                      <p className="text-xs text-gray-500 mt-1 capitalize">{order.paymentMethod}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus.replace('_', ' ')}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-warm-brown-800">Order Details</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Info */}
                <div className="space-y-4">
                  <div className="bg-warm-brown-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-warm-brown-800 mb-2">Order Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Number:</span>
                        <span className="font-medium">{selectedOrder.orderNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.orderStatus)}`}>
                          {selectedOrder.orderStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                          {selectedOrder.paymentStatus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-medium">LKR {selectedOrder.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="bg-sage-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-sage-green-800 mb-2">Order Items</h4>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-medium">LKR {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="space-y-4">
                  <div className="bg-cream-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-cream-800 mb-2">Delivery Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <p className="font-medium">{selectedOrder.deliveryInfo.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <p className="font-medium">{selectedOrder.deliveryInfo.phone}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <p className="font-medium">{selectedOrder.deliveryInfo.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Address:</span>
                        <p className="font-medium">{selectedOrder.deliveryInfo.address}</p>
                      </div>
                      {selectedOrder.deliveryInfo.specialNotes && (
                        <div>
                          <span className="text-gray-600">Special Notes:</span>
                          <p className="font-medium">{selectedOrder.deliveryInfo.specialNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Update Status */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Update Order Status</h4>
                    <div className="space-y-3">
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sage-green-500">
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button className="w-full bg-sage-green-500 text-white py-2 rounded-lg hover:bg-sage-green-600 transition-colors">
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