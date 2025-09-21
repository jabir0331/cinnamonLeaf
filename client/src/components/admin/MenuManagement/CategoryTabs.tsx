import React from 'react';
import { CategoryTab } from '../../../types/menu';

interface CategoryTabsProps {
    categories: CategoryTab[];
    activeCategory: string;
    isLoading: boolean;
    onCategoryChange: (categoryId: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
    categories,
    activeCategory,
    isLoading,
    onCategoryChange
}) => {
    return (
        <div className="mb-2">
            <div className="flex gap-1 bg-warm-brown-100 rounded-xl p-1.5 mb-5 overflow-x-auto">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onCategoryChange(category.id)}
                        disabled={isLoading}
                        className={`
              flex-1 min-w-0 px-4 py-3 rounded-lg text-sm font-medium font-body
              transition-all duration-200 ease-in-out
              flex items-center justify-center gap-2
              whitespace-nowrap
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              ${activeCategory === category.id
                                ? 'bg-white text-sage-green-600 shadow-sm'
                                : 'bg-transparent text-warm-brown-600 hover:bg-white/70 hover:text-sage-green-600'
                            }
            `}
                    >
                        {category.icon && (
                            <span className="text-base block">
                                {category.icon}
                            </span>
                        )}
                        {category.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryTabs;