import React, { useState } from 'react';
import { Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';

const CustomerManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const customers = [
    {
      _id: '68a94936ad096cbc357f0d26',
      name: 'Nihmath Jabir',
      email: 'mnnjabir@gmail.com',
      phone: '+94756742490',
      totalOrders: 15,
      totalSpent: 'LKR 34,250',
      lastOrder: '2025-08-23',
      status: 'Active'
    },
    {
      _id: '68a94936ad096cbc357f0d27',
      name: 'Soniya Gandhi',
      email: 'kabirSingh@gmail.com',
      phone: '0756045410',
      totalOrders: 8,
      totalSpent: 'LKR 18,900',
      lastOrder: '2025-08-22',
      status: 'Active'
    },
    {
      _id: '68a94936ad096cbc357f0d28',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+94701234567',
      totalOrders: 22,
      totalSpent: 'LKR 56,780',
      lastOrder: '2025-08-20',
      status: 'VIP'
    }
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'VIP':
        return 'bg-purple-100 text-purple-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-warm-brown-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-warm-brown-200 rounded-lg focus:outline-none focus:border-sage-green-500"
            />
          </div>
          <button className="flex items-center space-x-2 bg-warm-brown-100 text-warm-brown-800 px-4 py-2 rounded-lg hover:bg-warm-brown-200 transition-colors">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-warm-brown-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-warm-brown-50">
              <tr>
                <th className="text-left p-4 font-semibold text-warm-brown-800">Customer</th>
                <th className="text-left p-4 font-semibold text-warm-brown-800">Email</th>
                <th className="text-left p-4 font-semibold text-warm-brown-800">Mobile Number</th>
                <th className="text-left p-4 font-semibold text-warm-brown-800">Orders</th>
                <th className="text-left p-4 font-semibold text-warm-brown-800">Total Spent</th>
                <th className="text-left p-4 font-semibold text-warm-brown-800">Last Order</th>
                <th className="text-left p-4 font-semibold text-warm-brown-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer._id} className="border-t border-warm-brown-100 hover:bg-warm-brown-25 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm text-gray-900">{customer.email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm text-gray-500">{customer.phone}</p>
                    </div> 
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-gray-900">{customer.totalOrders}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-gray-900">{customer.totalSpent}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-600">{customer.lastOrder}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-warm-brown-800">Customer Details</h3>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <p className="text-gray-900">{selectedCustomer.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCustomer.status)}`}>
                      {selectedCustomer.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-900">{selectedCustomer.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Orders</label>
                    <p className="text-gray-900">{selectedCustomer.totalOrders}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Spent</label>
                    <p className="text-gray-900">{selectedCustomer.totalSpent}</p>
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

export default CustomerManagement;