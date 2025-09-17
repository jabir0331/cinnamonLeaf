import React, { useState } from 'react';
import { Search, Plus, Edit, Image, Grid, List, Eye, Power, PowerOff } from 'lucide-react';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  image: string;
  status: 'enabled' | 'disabled';
}

const MenuManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      _id: '68a789910e28eb07cc40f0a1',
      name: 'Vanilla Milkshake',
      description: 'Thick and creamy blend of vanilla ice cream and milk, whipped smooth for the perfect treat',
      category: 'Beverages',
      price: 'LKR 850',
      image: 'https://images.pexels.com/photos/1362534/pexels-photo-1362534.jpeg',
      status: 'enabled'
    },
    {
      _id: '68a789910e28eb07cc40f0a2',
      name: 'Hyderabad Chicken Biriyani',
      description: 'Aromatic basmati rice layered with tender chicken, cooked with traditional spices',
      category: 'Main Courses',
      price: 'LKR 2250',
      image: 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg',
      status: 'enabled'
    },
    {
      _id: '68a789910e28eb07cc40f0a3',
      name: 'Chocolate Brownie',
      description: 'Rich, fudgy chocolate brownie served warm with vanilla ice cream',
      category: 'Desserts',
      price: 'LKR 650',
      image: 'https://images.pexels.com/photos/887853/pexels-photo-887853.jpeg',
      status: 'disabled'
    },
    {
      _id: '68a789910e28eb07cc40f0a4',
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with parmesan cheese, croutons and Caesar dressing',
      category: 'Salads',
      price: 'LKR 1200',
      image: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg',
      status: 'enabled'
    }
  ]);

  const categories: string[] = ['All', 'Beverages', 'Main Courses', 'Desserts', 'Salads', 'Appetizers'];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItemStatus = (itemId: string): void => {
    setMenuItems(prevItems =>
      prevItems.map(item =>
        item._id === itemId
          ? { ...item, status: item.status === 'enabled' ? 'disabled' : 'enabled' }
          : item
      )
    );
  };

  const openDetailModal = (item: MenuItem): void => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const nextSibling = target.nextElementSibling as HTMLElement;
    if (nextSibling) {
      nextSibling.classList.remove('hidden');
    }
  };

  const CardView: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredItems.map((item) => (
        <div key={item._id} className={`bg-white rounded-lg shadow-sm border border-warm-brown-100 overflow-hidden hover:shadow-md transition-shadow ${item.status === 'disabled' ? 'opacity-60' : ''}`}>
          <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden relative">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
            <div className="hidden flex items-center justify-center text-gray-500">
              <Image size={48} />
            </div>
            {item.status === 'disabled' && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                Disabled
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-sm text-sage-green-600">{item.category}</p>
              </div>
              <span className="font-bold text-warm-brown-600">{item.price}</span>
            </div>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => openDetailModal(item)}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                  title="View Details"
                  type="button"
                >
                  <Eye size={16} />
                </button>
                <button 
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" 
                  title="Edit"
                  type="button"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => toggleItemStatus(item._id)}
                  className={`p-2 rounded-lg transition-colors ${
                    item.status === 'enabled' 
                      ? 'text-red-600 hover:bg-red-100' 
                      : 'text-green-600 hover:bg-green-100'
                  }`}
                  title={item.status === 'enabled' ? 'Disable' : 'Enable'}
                  type="button"
                >
                  {item.status === 'enabled' ? <PowerOff size={16} /> : <Power size={16} />}
                </button>
              </div>
              <span className="text-xs text-gray-500">ID: {item._id.slice(-8)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const TableView: React.FC = () => (
    <div className="bg-white rounded-lg shadow-sm border border-warm-brown-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-warm-brown-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <tr key={item._id} className={`hover:bg-gray-50 ${item.status === 'disabled' ? 'opacity-60' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <img
                        className="h-12 w-12 rounded-lg object-cover"
                        src={item.image}
                        alt={item.name}
                        onError={handleImageError}
                      />
                      <div className="hidden h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                        <Image size={20} className="text-gray-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">{item.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-sage-green-100 text-sage-green-800 rounded-full">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-warm-brown-600">
                  {item.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    item.status === 'enabled' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.status === 'enabled' ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => openDetailModal(item)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                      title="View Details"
                      type="button"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" 
                      title="Edit"
                      type="button"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => toggleItemStatus(item._id)}
                      className={`p-2 rounded-lg transition-colors ${
                        item.status === 'enabled' 
                          ? 'text-red-600 hover:bg-red-100' 
                          : 'text-green-600 hover:bg-green-100'
                      }`}
                      title={item.status === 'enabled' ? 'Disable' : 'Enable'}
                      type="button"
                    >
                      {item.status === 'enabled' ? <PowerOff size={16} /> : <Power size={16} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm px-4 py-3 border border-warm-brown-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex gap-2 w-full">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-1 px-6 py-2 rounded-lg transition-colors ${selectedCategory === category
                    ? 'bg-sage-green-500 text-white'
                    : 'bg-warm-brown-100 text-warm-brown-800 hover:bg-warm-brown-200'
                  }`}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search, Filter and View Toggle */}
      <div className="bg-white rounded-lg shadow-sm px-4 py-3 border border-warm-brown-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-warm-brown-200 rounded-lg focus:outline-none focus:border-sage-green-500"
            />
          </div>

          <div className="flex items-center gap-2">

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-sage-green-500 text-white px-4 py-2 rounded-lg hover:bg-sage-green-600 transition-colors"
              type="button"
            >
              <Plus size={20} />
              <span>Add Menu Item</span>
            </button>

            {/* View Toggle */}
            <div className="flex items-center bg-warm-brown-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('card')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  viewMode === 'card' 
                    ? 'bg-white text-sage-green-600 shadow-sm' 
                    : 'text-warm-brown-600 hover:text-warm-brown-800'
                }`}
                type="button"
              >
                <Grid size={16} />
                <span className="text-sm">Card View</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-white text-sage-green-600 shadow-sm' 
                    : 'text-warm-brown-600 hover:text-warm-brown-800'
                }`}
                type="button"
              >
                <List size={16} />
                <span className="text-sm">Table View</span>
              </button>
            </div>

            
          </div>
        </div>
      </div>

      {/* Menu Items Display */}
      {viewMode === 'card' ? <CardView /> : <TableView />}

      {/* Add Menu Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-warm-brown-800">Add New Menu Item</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                  type="button"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-warm-brown-200 rounded-lg focus:outline-none focus:border-sage-green-500"
                      placeholder="Item name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select className="w-full px-3 py-2 border border-warm-brown-200 rounded-lg focus:outline-none focus:border-sage-green-500">
                      <option>Beverages</option>
                      <option>Main Courses</option>
                      <option>Desserts</option>
                      <option>Salads</option>
                      <option>Appetizers</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-warm-brown-200 rounded-lg focus:outline-none focus:border-sage-green-500"
                    placeholder="Item description"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-warm-brown-200 rounded-lg focus:outline-none focus:border-sage-green-500"
                      placeholder="LKR 0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="url"
                      className="w-full px-3 py-2 border border-warm-brown-200 rounded-lg focus:outline-none focus:border-sage-green-500"
                      placeholder="Image URL"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-sage-green-500 text-white rounded-lg hover:bg-sage-green-600 transition-colors"
                    type="button"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail View Modal */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-warm-brown-800">Menu Item Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                  type="button"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Section */}
                <div className="space-y-4">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.name}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                    <div className="hidden flex items-center justify-center text-gray-500">
                      <Image size={64} />
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="flex justify-center">
                    <span className={`inline-flex px-4 py-2 text-sm font-medium rounded-full ${
                      selectedItem.status === 'enabled' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedItem.status === 'enabled' ? 'Available' : 'Currently Unavailable'}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Name</h4>
                    <p className="text-xl font-semibold text-gray-900">{selectedItem.name}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Category</h4>
                    <span className="inline-flex px-3 py-1 text-sm font-medium bg-sage-green-100 text-sage-green-800 rounded-full">
                      {selectedItem.category}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Price</h4>
                    <p className="text-2xl font-bold text-warm-brown-600">{selectedItem.price}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Description</h4>
                    <p className="text-gray-700 leading-relaxed">{selectedItem.description}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Item ID</h4>
                    <p className="text-sm font-mono text-gray-600">{selectedItem._id}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button 
                      className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      type="button"
                    >
                      <Edit size={16} />
                      <span>Edit Item</span>
                    </button>
                    <button 
                      onClick={() => {
                        toggleItemStatus(selectedItem._id);
                        setSelectedItem(prev => prev ? ({
                          ...prev,
                          status: prev.status === 'enabled' ? 'disabled' : 'enabled'
                        }) : null);
                      }}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        selectedItem.status === 'enabled' 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                      type="button"
                    >
                      {selectedItem.status === 'enabled' ? <PowerOff size={16} /> : <Power size={16} />}
                      <span>{selectedItem.status === 'enabled' ? 'Disable' : 'Enable'}</span>
                    </button>
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

export default MenuManagement;