import React from 'react';
import { TrendingUp, Users, ShoppingBag, DollarSign, History, Eye } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-warm-brown-100">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <div className="flex items-center justify-between mt-2 mb-1">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon size={24} className="text-white" />
                  </div>
                </div>

                <p className={`text-sm mt-1 ${stat.changeColor}`}>{stat.change} from last month</p>
              </div>
            );
          })}
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <History className="mr-3 text-sage-green-600" size={24} />
                Recent Orders
              </div>
              <button className="px-4 py-2 bg-sage-green-500 text-white rounded-lg hover:bg-sage-green-600 transition-colors duration-200 flex items-center text-sm font-medium">
                <Eye size={16} className="mr-2" />
                View All
              </button>
            </h3>
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-150 transition-all duration-200 border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-sage-green-100 rounded-full flex items-center justify-center">
                      <Users size={16} className="text-sage-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-lg">{order.amount}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)} capitalize`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <TrendingUp className="mr-3 text-warm-brown-600" size={24} />
              Quick Actions
            </h3>
            <div className="space-y-4">
              <button className="w-full p-4 bg-gradient-to-r from-sage-green-500 to-sage-green-600 text-white rounded-xl hover:from-sage-green-600 hover:to-sage-green-700 transition-all duration-300 text-left flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                <TrendingUp size={20} className="mr-3" />
                Add New Menu Item
              </button>
              <button className="w-full p-4 bg-gradient-to-r from-warm-brown-500 to-warm-brown-600 text-white rounded-xl hover:from-warm-brown-600 hover:to-warm-brown-700 transition-all duration-300 text-left flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                <ShoppingBag size={20} className="mr-3" />
                View Pending Orders
              </button>
              <button className="w-full p-4 bg-gradient-to-r from-cream-600 to-cream-700 text-white rounded-xl hover:from-cream-700 hover:to-cream-800 transition-all duration-300 text-left flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                <DollarSign size={20} className="mr-3" />
                Generate Sales Report
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;