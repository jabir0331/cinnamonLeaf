import React from 'react';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Revenue this Month',
      value: 'LKR 125,840',
      change: '+12.5%',
      icon: DollarSign,
      color: 'bg-sage-green-500',
      changeColor: 'text-green-600'
    },
    {
      title: 'Total Orders Today',
      value: '1,234',
      change: '+8.2%',
      icon: ShoppingBag,
      color: 'bg-warm-brown-500',
      changeColor: 'text-green-600'
    },
    {
      title: 'Registered Customers',
      value: '892',
      change: '+3.1%',
      icon: Users,
      color: 'bg-cream-600',
      changeColor: 'text-green-600'
    },
    {
      title: 'Order Rate vs Yesterday',
      value: '15.8%',
      change: '+2.4%',
      icon: TrendingUp,
      color: 'bg-sage-green-600',
      changeColor: 'text-green-600'
    }
  ];

  const recentOrders = [
    {
      orderNumber: 'ORD-DEA032A8',
      customer: 'Soniya Gandhi',
      amount: 'LKR 2,250',
      status: 'out_for_delivery',
      time: '10:57 AM'
    },
    {
      orderNumber: 'ORD-BFC123D9',
      customer: 'Rajesh Kumar',
      amount: 'LKR 1,800',
      status: 'preparing',
      time: '11:15 AM'
    },
    {
      orderNumber: 'ORD-CAE456F2',
      customer: 'Priya Sharma',
      amount: 'LKR 950',
      status: 'paid',
      time: '11:32 AM'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'out_for_delivery':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-warm-brown-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.changeColor}`}>{stat.change} from last month</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-warm-brown-100">
          <h3 className="text-lg font-semibold text-warm-brown-800 mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {recentOrders.map((order, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-warm-brown-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{order.orderNumber}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{order.amount}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-warm-brown-100">
          <h3 className="text-lg font-semibold text-warm-brown-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full p-3 bg-sage-green-500 text-white rounded-lg hover:bg-sage-green-600 transition-colors text-left">
              Add New Menu Item
            </button>
            <button className="w-full p-3 bg-warm-brown-500 text-white rounded-lg hover:bg-warm-brown-600 transition-colors text-left">
              View Pending Orders
            </button>
            <button className="w-full p-3 bg-cream-600 text-white rounded-lg hover:bg-cream-700 transition-colors text-left">
              Generate Sales Report
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;