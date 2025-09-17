import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Star, Calendar } from 'lucide-react';

const Analytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const salesData = [
    { day: 'Mon', revenue: 15600, orders: 45 },
    { day: 'Tue', revenue: 18200, orders: 52 },
    { day: 'Wed', revenue: 21800, orders: 61 },
    { day: 'Thu', revenue: 16900, orders: 48 },
    { day: 'Fri', revenue: 24500, orders: 68 },
    { day: 'Sat', revenue: 28200, orders: 78 },
    { day: 'Sun', revenue: 26400, orders: 71 }
  ];

  const topItems = [
    { name: 'Hyderabad Chicken Biriyani', orders: 128, revenue: 'LKR 288,000' },
    { name: 'Vanilla Milkshake', orders: 96, revenue: 'LKR 81,600' },
    { name: 'Caesar Salad', orders: 72, revenue: 'LKR 86,400' },
    { name: 'Chocolate Brownie', orders: 64, revenue: 'LKR 41,600' }
  ];

  const metrics = [
    {
      title: 'Total Revenue',
      value: 'LKR 151,600',
      change: '+15.3%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Total Orders',
      value: '423',
      change: '+12.8%',
      changeType: 'increase',
      icon: ShoppingBag,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Average Order Value',
      value: 'LKR 1,785',
      change: '+5.2%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      title: 'Customer Satisfaction',
      value: '4.8/5',
      change: '+0.2',
      changeType: 'increase',
      icon: Star,
      color: 'text-yellow-600 bg-yellow-100'
    }
  ];

  const maxRevenue = Math.max(...salesData.map(d => d.revenue));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-warm-brown-800">Business Analytics</h1>
        <div className="flex items-center space-x-2">
          <Calendar size={20} className="text-gray-500" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-warm-brown-200 rounded-lg focus:outline-none focus:border-sage-green-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-warm-brown-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                  <div className="flex items-center mt-2">
                    {metric.changeType === 'increase' ? (
                      <TrendingUp size={16} className="text-green-500 mr-1" />
                    ) : (
                      <TrendingDown size={16} className="text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${metric.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-warm-brown-100">
          <h3 className="text-lg font-semibold text-warm-brown-800 mb-4">Daily Revenue Trend</h3>
          <div className="space-y-4">
            {salesData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 w-20">
                  <span className="text-sm font-medium text-gray-700">{data.day}</span>
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-warm-brown-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-sage-green-500 h-full transition-all duration-500"
                      style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right w-24">
                  <p className="text-sm font-semibold text-gray-900">LKR {data.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{data.orders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Menu Items */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-warm-brown-100">
          <h3 className="text-lg font-semibold text-warm-brown-800 mb-4">Top Menu Items</h3>
          <div className="space-y-4">
            {topItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-cream-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-sage-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{item.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-warm-brown-100">
          <h3 className="text-lg font-semibold text-warm-brown-800 mb-4">Order Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Delivered</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-green-100 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-green-500" />
                </div>
                <span className="text-sm font-medium">80%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">In Progress</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div className="w-1/5 h-full bg-blue-500" />
                </div>
                <span className="text-sm font-medium">15%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Cancelled</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-red-100 rounded-full overflow-hidden">
                  <div className="w-1/20 h-full bg-red-500" />
                </div>
                <span className="text-sm font-medium">5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-warm-brown-100">
          <h3 className="text-lg font-semibold text-warm-brown-800 mb-4">Peak Hours</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">12:00 - 14:00</span>
              <span className="text-sm font-semibold text-sage-green-600">35% of orders</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">18:00 - 21:00</span>
              <span className="text-sm font-semibold text-sage-green-600">42% of orders</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">21:00 - 23:00</span>
              <span className="text-sm font-semibold text-sage-green-600">18% of orders</span>
            </div>
          </div>
        </div>

        {/* Customer Insights */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-warm-brown-100">
          <h3 className="text-lg font-semibold text-warm-brown-800 mb-4">Customer Insights</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">New Customers</span>
              <span className="text-sm font-semibold text-blue-600">+23 this week</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Returning Rate</span>
              <span className="text-sm font-semibold text-green-600">68%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg. Rating</span>
              <span className="text-sm font-semibold text-yellow-600">4.8/5.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;