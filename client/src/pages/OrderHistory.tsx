import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Search, Hourglass, Calendar, Package, Clock, CheckCircle, Truck, X, Eye, RotateCcw, MapPin, Phone, CreditCard, Banknote } from 'lucide-react';
import { getUserOrders } from '../services/order';

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
}

interface DeliveryInfo{
    name: string;
    phone: string;
    email: string;
    address: string;
    specialNotes?: string;
}

interface Order {
    id: string;
    orderNumber: string;
    createdtedAt: string;
    updatedAt: string;
    orderStatus: 'pending' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';
    items: OrderItem[];
    totalAmount: number;
    paymentMethod: 'cod' | 'card';
    restaurantName: string;
    deliveryInfo: DeliveryInfo;
    estimatedDelivery?: string;
}

const OrderHistory: React.FC = () => {
    const token = localStorage.getItem('token');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {

        const fetchOrders = async () => {

            if (!token) return; // optionally redirect to login

            try {
                const data = await getUserOrders();
                if (data.success) {
                    setOrders(data.orders);
                    console.log(data.orders);
                } else {
                    toast.error(data.message || 'Failed to fetch orders');
                }
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch orders');
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        };

        fetchOrders();
    }, [token]);

    const getStatusConfig = (status: Order['orderStatus']) => {
        switch (status) {
            case 'delivered':
                return {
                    color: 'bg-green-50 text-green-700 border-green-200',
                    icon: <CheckCircle size={16} />,
                    label: 'Delivered'
                };
            case 'preparing':
                return {
                    color: 'bg-orange-50 text-orange-700 border-orange-200',
                    icon: <Clock size={16} />,
                    label: 'Preparing'
                };
            case 'out-for-delivery':
                return {
                    color: 'bg-blue-50 text-blue-700 border-blue-200',
                    icon: <Truck size={16} />,
                    label: 'On Delivery'
                };
            case 'pending':
                return {
                    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
                    icon: <Hourglass size={16} />,
                    label: 'Pending'
                };
            case 'cancelled':
                return {
                    color: 'bg-red-50 text-red-700 border-red-200',
                    icon: <X size={16} />,
                    label: 'Cancelled'
                };
            default:
                return {
                    color: 'bg-cream-50 text-warm-brown-700 border-cream-200',
                    icon: <Package size={16} />,
                    label: 'Unknown'
                };
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
        const matchesDate = dateFilter === 'all' ||
            (dateFilter === 'today' && new Date(order.updatedAt).toDateString() === new Date().toDateString()) ||
            (dateFilter === 'week' && new Date(order.updatedAt) >= new Date(new Date().setDate(new Date().getDate() - 7))) ||
            (dateFilter === 'month' && new Date(order.updatedAt).getMonth() === new Date().getMonth());

        return matchesSearch && matchesStatus && matchesDate;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cream-50 to-warm-brown-50 p-6">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-warm-brown-200 border-t-warm-brown-600 rounded-full animate-spin"></div>
                </div>
                <p className="mt-6 text-warm-brown-700 font-body text-lg">Loading your orders...</p>
                <p className="mt-2 text-warm-brown-500 text-sm">Retrieving your order history, please wait a moment</p>
            </div>
        );
    }

    const handleReorder = (order: Order) => {
        // Implement reorder functionality
        console.log('Reordering:', order.orderNumber);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-cream-50">
            {/* Fixed Header Section with Integrated Filters */}
            <div className="sticky top-15 md:top-20 z-40 bg-cream-50 border-b shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
                    {/* Header Content */}
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-brown-700 mb-4">
                        Order History
                    </h2>
                    <p className="font-body text-lg text-warm-brown-600 max-w-7xl mb-2">
                        Track your culinary journey and reorder your favorite dishes with ease
                    </p>
                    
                    {/* Filters Section */}
                    <div className="py-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search Bar */}
                            <div className="flex-1">
                                <div className="relative">
                                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-brown-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by order number or item name..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-cream-300 rounded-lg font-body focus:ring-2 focus:ring-sage-green-500 focus:border-sage-green-500 transition-colors bg-white"
                                    />
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div className="lg:w-48">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-4 py-3 border border-cream-300 rounded-lg font-body focus:ring-2 focus:ring-sage-green-500 focus:border-sage-green-500 transition-colors bg-white"
                                >
                                    <option value="all">All Status</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="preparing">Preparing</option>
                                    <option value="on-delivery">On Delivery</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            {/* Date Filter */}
                            <div className="lg:w-48">
                                <select
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="w-full px-4 py-3 border border-cream-300 rounded-lg font-body focus:ring-2 focus:ring-sage-green-500 focus:border-sage-green-500 transition-colors bg-white"
                                >
                                    <option value="all">All Time</option>
                                    <option value="today">Today</option>
                                    <option value="week">This Week</option>
                                    <option value="month">This Month</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-cream-200 p-12 text-center">
                        <Package size={48} className="text-cream-300 mx-auto mb-4" />
                        <h3 className="font-display text-xl font-semibold text-warm-brown-700 mb-2">
                            No orders found
                        </h3>
                        <p className="font-body text-warm-brown-500">
                            {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                                ? 'Try adjusting your filters to see more results.'
                                : 'You haven\'t placed any orders yet.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => {
                            const statusConfig = getStatusConfig(order.orderStatus);
                            return (
                                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-cream-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                                    {/* Order Header */}
                                    <div className="p-6 border-b border-cream-100">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                <div>
                                                    <h3 className="font-body text-lg font-semibold text-warm-brown-700">
                                                        {order.orderNumber}
                                                    </h3>
                                                    <p className="font-body text-sm text-warm-brown-500 flex items-center gap-1 mt-1">
                                                        <Calendar size={14} />
                                                        {formatDate(order.updatedAt)}
                                                    </p>
                                                </div>
                                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${statusConfig.color}`}>
                                                    {statusConfig.icon}
                                                    {statusConfig.label}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-cream-100 hover:bg-cream-200 text-warm-brown-700 rounded-lg font-body font-medium transition-colors duration-200"
                                                >
                                                    <Eye size={16} />
                                                    View Details
                                                </button>
                                                {order.orderStatus === 'delivered' && (
                                                    <button
                                                        onClick={() => handleReorder(order)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-sage-green-600 hover:bg-sage-green-700 text-white rounded-lg font-body font-medium transition-colors duration-200"
                                                    >
                                                        <RotateCcw size={16} />
                                                        Reorder
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Content */}
                                    <div className="p-6">
                                        <div className="grid lg:grid-cols-3 gap-6">
                                            {/* Items */}
                                            <div className="lg:col-span-2">
                                                <h4 className="font-body font-semibold text-warm-brown-700 mb-3">
                                                    Items Ordered ({order.items.length})
                                                </h4>
                                                <div className="space-y-3">
                                                    {order.items.map((item) => (
                                                        <div key={item.id} className="flex items-center gap-3 p-3 bg-cream-50 rounded-lg">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-12 h-12 object-cover rounded-lg"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-body font-medium text-warm-brown-700 truncate">
                                                                    {item.name}
                                                                </p>
                                                                <p className="font-body text-sm text-warm-brown-500">
                                                                    Qty: {item.quantity} × LKR {item.price.toLocaleString()}
                                                                </p>
                                                            </div>
                                                            <p className="font-body font-semibold text-sage-green-600">
                                                                LKR {(item.quantity * item.price).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Order Summary */}
                                            <div className="bg-cream-50 rounded-lg p-4">
                                                <h4 className="font-body font-semibold text-warm-brown-700 mb-3">
                                                    Payment Summary
                                                </h4>
                                                <div className="space-y-3">

                                                    <div className="flex justify-between items-center">
                                                        <span className="font-body text-warm-brown-600">Payment Method:</span>
                                                        <div className="flex items-center gap-1">
                                                            {order.paymentMethod === 'cod' ? (
                                                                <Banknote size={14} className="text-warm-brown-600" />
                                                            ) : (
                                                                <CreditCard size={14} className="text-warm-brown-600" />
                                                            )}
                                                            <span className="font-body font-medium text-warm-brown-700">
                                                                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {order.estimatedDelivery && (
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-body text-warm-brown-600">ETA:</span>
                                                            <span className="font-body font-medium text-warm-brown-700">
                                                                {order.estimatedDelivery}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="border-t border-cream-200 pt-3 mt-3">
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-body font-semibold text-warm-brown-700">Total:</span>
                                                            <span className="font-body text-xl font-bold text-sage-green-600">
                                                                LKR {order.totalAmount.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSelectedOrder(null)} />

                        <div className="relative bg-white rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                {/* Modal Header */}
                                <div className="sticky top-0 left-0 bg-white z-50 pt-6 pb-8 flex items-center justify-between border-b mb-5">
                                    <h2 className="font-display text-2xl font-bold text-warm-brown-700">
                                        Order Details
                                    </h2>
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="p-2 hover:bg-cream-100 rounded-full transition-colors"
                                    >
                                        <X size={20} className="text-warm-brown-600" />
                                    </button>
                                </div>

                                {/* Order Info */}
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-1 gap-4">
                                        <div className="bg-cream-50 rounded-lg p-4">
                                            <h3 className="font-body font-semibold text-warm-brown-700 mb-3 flex items-center gap-2">
                                                <Package size={18} />
                                                Order Information
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-warm-brown-600">Order Number:</span>
                                                    <span className="font-medium text-warm-brown-700">{selectedOrder.orderNumber}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-warm-brown-600">Date:</span>
                                                    <span className="font-medium text-warm-brown-700">{formatDate(selectedOrder.updatedAt)}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-warm-brown-600">Status:</span>
                                                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${getStatusConfig(selectedOrder.orderStatus).color}`}>
                                                        {getStatusConfig(selectedOrder.orderStatus).icon}
                                                        {getStatusConfig(selectedOrder.orderStatus).label}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-cream-50 rounded-lg p-4">
                                            <h3 className="font-body font-semibold text-warm-brown-700 mb-3 flex items-center gap-2">
                                                <MapPin size={18} />
                                                Delivery Information
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-warm-brown-600">Address:</span>
                                                    <p className="font-medium text-warm-brown-700 mt-1">{selectedOrder.deliveryInfo.address}</p>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-warm-brown-600">Phone:</span>
                                                    <span className="font-medium text-warm-brown-700">{selectedOrder.deliveryInfo.phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items List */}
                                    <div>
                                        <h3 className="font-body font-semibold text-warm-brown-700 mb-4">
                                            Items Ordered
                                        </h3>
                                        <div className="space-y-3">
                                            {selectedOrder.items.map((item) => (
                                                <div key={item.id} className="flex items-center gap-4 p-4 bg-cream-50 rounded-lg">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-16 h-16 object-cover rounded-lg"
                                                    />
                                                    <div className="flex-1">
                                                        <h4 className="font-body font-medium text-warm-brown-700">{item.name}</h4>
                                                        <p className="font-body text-sm text-warm-brown-500">
                                                            Quantity: {item.quantity} × LKR {item.price.toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-body font-semibold text-sage-green-600">
                                                            LKR {(item.quantity * item.price).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="border-t border-cream-200 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="font-display text-xl font-semibold text-warm-brown-700">
                                                Total Amount:
                                            </span>
                                            <span className="font-body text-2xl font-bold text-sage-green-600">
                                                LKR {selectedOrder.totalAmount.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        {selectedOrder.orderStatus === 'delivered' && (
                                            <button
                                                onClick={() => handleReorder(selectedOrder)}
                                                className="flex-1 bg-sage-green-600 hover:bg-sage-green-700 text-white font-body font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                            >
                                                <RotateCcw size={18} />
                                                Reorder Items
                                            </button>
                                        )}
                                        
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

export default OrderHistory;