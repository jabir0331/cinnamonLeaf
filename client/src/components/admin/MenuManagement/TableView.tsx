import React from 'react';
import { Eye, Edit, Power, PowerOff, Image, Flame, Salad } from 'lucide-react';
import { MenuItem } from '../../../types/menu';

interface TableViewProps {
  items: MenuItem[];
  onViewDetails: (item: MenuItem) => void;
  onEditItem: (item: MenuItem) => void;
  onToggleStatus: (itemId: string) => void;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

const TableView: React.FC<TableViewProps> = ({
  items,
  onViewDetails,
  onEditItem,
  onToggleStatus,
  onImageError
}) => {
  return (
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
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <Image size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No menu items found</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id} className={`hover:bg-gray-50 ${item.status === 'Unavailable' ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={item.image}
                          alt={item.name}
                          onError={onImageError}
                        />
                        <div className="hidden h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                          <Image size={20} className="text-gray-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                          <span>{item.name}</span>
                          {item.popular && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                              Popular
                            </span>
                          )}
                          {item.vegetarian && (
                            <div className="bg-green-500 text-white rounded-full p-1 shadow-lg text-xs" title="Vegetarian">
                              <Salad size={11} />
                            </div>
                          )}
                          {item.spicy && (
                            <div className="bg-red-500 text-white rounded-full p-1 shadow-lg text-xs" title="Spicy">
                              <Flame size={11} />
                            </div>
                          )}
                        </div>
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
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${item.status === 'Available'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {item.status === 'Available' ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onViewDetails(item)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="View Details"
                        type="button"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onEditItem(item)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit"
                        type="button"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onToggleStatus(item._id)}
                        className={`p-2 rounded-lg transition-colors ${item.status === 'Available'
                          ? 'text-red-600 hover:bg-red-100'
                          : 'text-green-600 hover:bg-green-100'
                          }`}
                        title={item.status === 'Available' ? 'Disable' : 'Enable'}
                        type="button"
                      >
                        {item.status === 'Available' ? <PowerOff size={16} /> : <Power size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableView;