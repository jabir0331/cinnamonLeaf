import React from 'react';
import { Edit, Power, PowerOff, Image } from 'lucide-react';
import { Category } from '../../../types/menu';
import { getImageUrl } from '../../../utils/imageUrl';

interface TableViewProps {
    categories: Category[];
    hasAnyCategories: boolean;
    onEditCategory: (category: Category) => void;
    onToggleStatus: (category: Category) => void;
}

const TableView: React.FC<TableViewProps> = ({
    categories,
    hasAnyCategories,
    onEditCategory,
    onToggleStatus
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-warm-brown-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-warm-brown-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center">
                                    <div className="text-gray-500">
                                        <Image size={48} className="mx-auto mb-4 opacity-50" />
                                        <p className="text-lg font-medium">{hasAnyCategories ? 'No categories found' : 'No categories yet'}</p>
                                        <p className="text-sm">
                                            {hasAnyCategories
                                                ? 'Try adjusting your search or filter criteria'
                                                : 'Click "Add New Category" to create your first one'}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            categories.map((category) => (
                                <tr
                                    key={category._id}
                                    onClick={() => onEditCategory(category)}
                                    className={`hover:bg-gray-50 cursor-pointer ${category.isActive ? '' : 'opacity-60'}`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-12 w-12">
                                                {category.image ? (
                                                    <img
                                                        className="h-12 w-12 rounded-lg object-cover"
                                                        src={getImageUrl(category.image)}
                                                        alt={category.name}
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                                        <Image size={20} className="text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4 text-sm font-medium text-gray-900">
                                                {category.name}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500 max-w-md truncate">{category.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${category.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {category.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onEditCategory(category); }}
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                title="Edit"
                                                type="button"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onToggleStatus(category); }}
                                                className={`p-2 rounded-lg transition-colors ${category.isActive
                                                    ? 'text-red-600 hover:bg-red-100'
                                                    : 'text-green-600 hover:bg-green-100'
                                                    }`}
                                                title={category.isActive ? 'Disable' : 'Enable'}
                                                type="button"
                                            >
                                                {category.isActive ? <PowerOff size={16} /> : <Power size={16} />}
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
