import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Search, Hourglass, Calendar, Package, CheckCircle, Truck, X, Eye, RotateCcw, CreditCard, Banknote, Timer } from 'lucide-react';
import { getUserOrders } from '../services/order';
import { getImageUrl } from '../utils/imageUrl';
import { ORDER_STATUS_LABELS } from '../utils/orderConfirmation';
import { addOrderToCart } from '../utils/reorder';

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
}

interface DeliveryInfo {
    name: string;
    phone: string;
    email: string;
    address: string;
    specialNotes?: string;
}

interface Order {
    _id: string;
    orderNumber: string;
    createdAt: string;
    orderStatus: 'pending'| 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
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

    const navigate = useNavigate();
    const location = useLocation();

    // The filters live in the address bar, so they are still there after opening an order and coming back
    const [searchParams, setSearchParams] = useSearchParams();
    const searchTerm = searchParams.get('q') ?? '';
    const statusFilter = searchParams.get('status') ?? 'all';
    const dateFilter = searchParams.get('date') ?? 'all';
    const setFilter = (key: string, value: string, defaultValue: string) => {
        setSearchParams(previous => {
            const next = new URLSearchParams(previous);
            if (value === defaultValue) next.delete(key);
            else next.set(key, value);
            return next;
        }, { replace: true });
    };

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
            case 'pending':
                return {
                    color: 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 border-yellow-200 shadow-sm',
                    icon: <Hourglass size={16} className="drop-shadow-sm animate-pulse" />,
                    label: ORDER_STATUS_LABELS['pending'],
                    pulseColor: 'bg-yellow-400'
                };
            case 'confirmed':
                return {
                    color: 'bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 border-teal-200 shadow-sm',
                    icon: <CheckCircle size={16} className="drop-shadow-sm" />,
                    label: ORDER_STATUS_LABELS['confirmed'],
                    pulseColor: 'bg-teal-400'
                };
            case 'preparing':
                return {
                    color: 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-orange-200 shadow-sm',
                    icon: <Timer size={16} className="drop-shadow-sm animate-pulse" />,
                    label: ORDER_STATUS_LABELS['preparing'],
                    pulseColor: 'bg-orange-400'
                };
            case 'out_for_delivery':
                return {
                    color: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200 shadow-sm',
                    icon: <Truck size={16} className="drop-shadow-sm" />,
                    label: ORDER_STATUS_LABELS['out_for_delivery'],
                    pulseColor: 'bg-blue-400'
                };
            case 'delivered':
                return {
                    color: 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200 shadow-sm',
                    icon: <CheckCircle size={16} className="drop-shadow-sm" />,
                    label: ORDER_STATUS_LABELS['delivered'],
                    pulseColor: 'bg-green-400'
                };
            case 'cancelled':
                return {
                    color: 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200 shadow-sm',
                    icon: <X size={16} className="drop-shadow-sm" />,
                    label: ORDER_STATUS_LABELS['cancelled'],
                    pulseColor: 'bg-red-400'
                };
            default:
                return {
                    color: 'bg-gradient-to-r from-cream-50 to-cream-100 text-warm-brown-700 border-cream-200 shadow-sm',
                    icon: <Package size={16} className="drop-shadow-sm" />,
                    label: 'Unknown',
                    pulseColor: 'bg-cream-400'
                };
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
        const matchesDate = dateFilter === 'all' ||
            (dateFilter === 'today' && new Date(order.createdAt).toDateString() === new Date().toDateString()) ||
            (dateFilter === 'week' && new Date(order.createdAt) >= new Date(new Date().setDate(new Date().getDate() - 7))) ||
            (dateFilter === 'month' && new Date(order.createdAt).getMonth() === new Date().getMonth());

        return matchesSearch && matchesStatus && matchesDate;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cream-50 via-warm-brown-50 to-sage-green-50 p-6">
                <div className="relative mb-8">
                    <div className="w-16 h-16 border-4 border-warm-brown-200 border-t-warm-brown-600 rounded-full animate-spin shadow-lg"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-sage-green-400 rounded-full animate-spin animate-reverse" style={{ animationDuration: '1.5s' }}></div>
                </div>
                <div className="text-center">
                    <p className="mt-6 text-warm-brown-700 font-display text-2xl font-semibold">Loading your orders...</p>
                    <p className="mt-2 text-warm-brown-500 font-body text-base">Retrieving your order history, please wait a moment</p>
                </div>
            </div>
        );
    }

    // Puts the items of a past order back in the cart and opens it on the menu page
    const handleReorder = (order: Order) => {
        if (addOrderToCart(order.items) === 0) {
            toast.info('These items are no longer available to reorder.');
            return;
        }
        toast.success('Items from this order were added to your cart.');
        navigate('/menu', { state: { resumeCheckout: true } });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cream-50 via-warm-brown-25 to-sage-green-25">
            {/* Fixed Header Section with Integrated Filters */}
            <div className="sticky top-15 md:top-20 z-40 bg-cream-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                    {/* Header Content */}
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-brown-700 mb-4">
                        Order History
                    </h2>
                    <p className="font-body text-lg text-warm-brown-600 max-w-7xl mb-2">
                        Track your culinary journey and reorder your favorite dishes with ease
                    </p>

                    {/* Filters Section */}
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
                                        onChange={(e) => setFilter('q', e.target.value, '')}
                                        className="w-full pl-10 pr-4 py-2 border border-cream-300 rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-sage-green-300 transition-colors bg-white"
                                    />
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div className="lg:w-48">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setFilter('status', e.target.value, 'all')}
                                    className="w-full px-4 py-2 border border-cream-300 rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-sage-green-300 transition-colors bg-white"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">{ORDER_STATUS_LABELS.pending}</option>
                                    <option value="confirmed">{ORDER_STATUS_LABELS.confirmed}</option>
                                    <option value="preparing">{ORDER_STATUS_LABELS.preparing}</option>
                                    <option value="out_for_delivery">{ORDER_STATUS_LABELS.out_for_delivery}</option>
                                    <option value="delivered">{ORDER_STATUS_LABELS.delivered}</option>
                                    <option value="cancelled">{ORDER_STATUS_LABELS.cancelled}</option>
                                </select>
                            </div>

                            {/* Date Filter */}
                            <div className="lg:w-48">
                                <select
                                    value={dateFilter}
                                    onChange={(e) => setFilter('date', e.target.value, 'all')}
                                    className="w-full px-4 py-2 border border-cream-300 rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-sage-green-300 transition-colors bg-white"
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
            <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                {/* Empty State  */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-sage-green-200 p-16 text-center">
                        <div className="relative mb-6">
                            <Package size={64} className="text-cream-300 mx-auto" />
                        </div>
                        <h3 className="font-display text-2xl font-semibold text-warm-brown-700 mb-4">
                            No orders found
                        </h3>
                        <p className="font-body text-warm-brown-500 text-lg leading-relaxed max-w-md mx-auto">
                            {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                                ? 'Try adjusting your filters to see more results.'
                                : 'You haven\'t placed any orders yet.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {filteredOrders.map((order, index) => {
                            const statusConfig = getStatusConfig(order.orderStatus);
                            return (
                                <div key={order._id} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-cream-200 overflow-hidden hover:shadow-2xl transform hover:scale-102 transition-all duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                                    {/* Enhanced Order Header */}
                                    <div className="relative p-8 border-b border-cream-100 bg-gradient-to-r from-cream-50/50 to-sage-green-50/50">

                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                                                <div className="relative">
                                                    <h3 className="font-body text-xl font-bold text-warm-brown-700 mb-2">
                                                        {order.orderNumber}
                                                    </h3>
                                                    <p className="font-body text-warm-brown-500 flex items-center gap-2">
                                                        <Calendar size={16} className="text-sage-green-500" />
                                                        {formatDate(order.createdAt)}
                                                    </p>
                                                </div>
                                                <div className="relative">
                                                    <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl border-2 text-sm font-semibold ${statusConfig.color} backdrop-blur-sm`}>
                                                        <div className="relative">
                                                            {statusConfig.icon}
                                                            {(order.orderStatus === 'preparing' || order.orderStatus === 'pending') && (
                                                                <div className={`absolute -top-1 -right-1 w-2 h-2 ${statusConfig.pulseColor} rounded-full animate-ping`}></div>
                                                            )}
                                                        </div>
                                                        {statusConfig.label}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <Link
                                                    to={`/orders/${encodeURIComponent(order.orderNumber)}`}
                                                    state={{ from: location.pathname + location.search }}
                                                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cream-100 to-cream-200 hover:from-cream-200 hover:to-cream-300 text-warm-brown-700 rounded-xl font-body font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 border border-cream-300"
                                                >
                                                    <Eye size={18} />
                                                    View Details
                                                </Link>
                                                {order.orderStatus === 'delivered' && (
                                                    <button
                                                        onClick={() => handleReorder(order)}
                                                        className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-sage-green-600 to-sage-green-700 hover:from-sage-green-700 hover:to-sage-green-800 text-white rounded-xl font-body font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                                                    >
                                                        <RotateCcw size={18} />
                                                        Reorder
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enhanced Order Content */}
                                    <div className="p-8">
                                        <div className="grid lg:grid-cols-2 gap-5">
                                            {/* Enhanced Items */}
                                            <div className="lg:col-span-1">
                                                <h4 className="font-display font-semibold text-warm-brown-700 mb-6 text-lg flex items-center gap-2">
                                                    <Package size={20} className="text-sage-green-600" />
                                                    Items Ordered ({order.items.length})
                                                </h4>
                                                <div className="space-y-4">
                                                    {order.items.map((item) => (
                                                        <div key={item.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-cream-50 to-sage-green-50 rounded-xl border border-cream-200/50 hover:shadow-md transition-all duration-200 group">
                                                            <div className="relative overflow-hidden rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-200">
                                                                <img
                                                                    src={getImageUrl(item.image)}
                                                                    alt={item.name}
                                                                    className="w-16 h-16 object-cover transform group-hover:scale-110 transition-transform duration-200"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-body font-semibold text-warm-brown-700 truncate text-base">
                                                                    {item.name}
                                                                </p>
                                                                <p className="font-body text-warm-brown-500 mt-1">
                                                                    Qty: {item.quantity} × LKR {item.price.toLocaleString()}
                                                                </p>
                                                            </div>
                                                            <p className="font-body font-bold text-sage-green-600 text-lg">
                                                                LKR {(item.quantity * item.price).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Enhanced Order Summary */}
                                            <div className="bg-gradient-to-br from-cream-50 to-sage-green-50 rounded-2xl p-6 border-2 border-cream-200 shadow-inner">
                                                <h4 className="font-display font-semibold text-warm-brown-700 mb-6 text-lg flex items-center gap-2">
                                                    <CreditCard size={20} className="text-sage-green-600" />
                                                    Payment Summary
                                                </h4>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                                                        <span className="font-body text-warm-brown-600">Payment Method:</span>
                                                        <div className="flex items-center gap-2">
                                                            {order.paymentMethod === 'cod' ? (
                                                                <Banknote size={16} className="text-warm-brown-600" />
                                                            ) : (
                                                                <CreditCard size={16} className="text-warm-brown-600" />
                                                            )}
                                                            <span className="font-body font-semibold text-warm-brown-700">
                                                                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {order.estimatedDelivery && (
                                                        <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                                                            <span className="font-body text-warm-brown-600">ETA:</span>
                                                            <span className="font-body font-semibold text-warm-brown-700">
                                                                {order.estimatedDelivery}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="border-t-2 border-cream-300 pt-4 mt-4">
                                                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-sage-green-100 to-warm-brown-100 rounded-xl border border-sage-green-200">
                                                            <span className="font-display font-bold text-warm-brown-700 text-lg">Total:</span>
                                                            <span className="font-body text-2xl font-bold text-sage-green-600">
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
        </div>
    );
};

export default OrderHistory;