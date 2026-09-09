import React from 'react';
import { Edit, Power, PowerOff, Image } from 'lucide-react';
import { Category } from '../../../types/menu';
import { getImageUrl } from '../../../utils/imageUrl';

interface CardViewProps {
    categories: Category[];
    hasAnyCategories: boolean;
    onEditCategory: (category: Category) => void;
    onToggleStatus: (category: Category) => void;
}

const CardView: React.FC<CardViewProps> = ({
    categories,
    hasAnyCategories,
    onEditCategory,
    onToggleStatus
}) => {
    if (categories.length === 0) {
        return (
            <div className="col-span-full text-center py-16">
                <div className="bg-gradient-to-br from-cream-50 to-sage-green-50 rounded-2xl p-12 mx-auto max-w-lg">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-sage-green-200 to-warm-brown-200 rounded-full opacity-20 blur-xl"></div>
                        <Image size={80} className="mx-auto mb-6 text-sage-green-400 relative z-10" />
                    </div>
                    <h3 className="text-xl font-display font-semibold text-gray-800 mb-2">
                        {hasAnyCategories ? 'No categories found' : 'No categories yet'}
                    </h3>
                    <p className="text-sage-green-600 font-body">
                        {hasAnyCategories
                            ? 'Try adjusting your search or filter criteria'
                            : 'Click "Add New Category" to create your first one'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
                <div
                    key={category._id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                >
                    <div className="h-40 bg-gradient-to-br from-cream-100 to-sage-green-100 relative overflow-hidden">
                        {category.image ? (
                            <img src={getImageUrl(category.image)} alt={category.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-warm-brown-300 font-body text-sm">
                                No image
                            </div>
                        )}
                        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${category.isActive
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                            }`}>
                            {category.isActive ? 'Active' : 'Inactive'}
                        </div>
                    </div>

                    <div className="p-5">
                        <h3 className="font-display text-lg font-semibold text-warm-brown-800 mb-2">{category.name}</h3>
                        <p className="text-sm text-warm-brown-600 font-body mb-4 line-clamp-2">{category.description}</p>

                        <div className="flex gap-2">
                            <button
                                onClick={() => onEditCategory(category)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-warm-brown-50 hover:bg-warm-brown-100 text-warm-brown-700 rounded-lg font-body text-sm font-medium transition-colors"
                                type="button"
                            >
                                <Edit size={14} />
                                Edit
                            </button>
                            <button
                                onClick={() => onToggleStatus(category)}
                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-body text-sm font-medium transition-colors ${category.isActive
                                    ? 'bg-red-50 hover:bg-red-100 text-red-700'
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                                    }`}
                                type="button"
                            >
                                {category.isActive ? <PowerOff size={14} /> : <Power size={14} />}
                                {category.isActive ? 'Disable' : 'Enable'}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CardView;
