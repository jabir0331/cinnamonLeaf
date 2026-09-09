// src/pages/admin/CategoryManagement.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus, X } from 'lucide-react';
import { getAllCategories, toggleCategoryStatus } from '../../services/categories';
import { Category } from '../../types/menu';
import LoadingState from '../../components/LoadingState';
import SearchBar from '../../components/admin/MenuManagement/SearchBar';
import ViewToggle from '../../components/admin/MenuManagement/ViewToggle';
import CardView from '../../components/admin/CategoryManagement/CardView';
import TableView from '../../components/admin/CategoryManagement/TableView';
import CategoryFormModal from '../../components/admin/CategoryManagement/CategoryFormModal';

const CategoryManagement: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryToToggle, setCategoryToToggle] = useState<Category | null>(null);

    const fetchCategories = async () => {
        try {
            const data = await getAllCategories();
            if (data.success) {
                setCategories(data.categories);
            } else {
                toast.error(data.message || 'Failed to fetch categories');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to fetch categories');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const isAnyModalOpen = showFormModal || !!categoryToToggle;
        document.body.style.overflow = isAnyModalOpen ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showFormModal, categoryToToggle]);

    const filteredCategories = categories.filter((category) => {
        const term = searchTerm.toLowerCase();
        return (
            category.name.toLowerCase().includes(term) ||
            category.description.toLowerCase().includes(term)
        );
    });

    const openAddModal = () => {
        setEditingCategory(null);
        setShowFormModal(true);
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setShowFormModal(true);
    };

    const confirmToggleStatus = async () => {
        if (!categoryToToggle) return;
        try {
            const response = await toggleCategoryStatus(categoryToToggle._id);
            if (response.success) {
                setCategories(prev =>
                    prev.map(c => c._id === categoryToToggle._id ? { ...c, isActive: !c.isActive } : c)
                );
                toast.success(`Category ${categoryToToggle.isActive ? 'disabled' : 'enabled'} successfully`);
            } else {
                toast.error('Failed to update category status');
            }
        } catch (error) {
            console.error('Error toggling category status:', error);
            toast.error('Failed to update category status');
        } finally {
            setCategoryToToggle(null);
        }
    };

    if (isLoading) {
        return <LoadingState message="Loading categories..." subMessage="Fetching category details, please wait a moment" />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4">
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder="Search categories..."
                />

                <div className="flex items-center gap-2">
                    <ViewToggle
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                    />

                    <button
                        onClick={openAddModal}
                        className="flex items-center space-x-2 bg-sage-green-500 text-white px-4 py-2 rounded-lg hover:bg-sage-green-600 transition-colors"
                        type="button"
                    >
                        <Plus size={20} />
                        <span>Add New Category</span>
                    </button>
                </div>
            </div>

            {viewMode === 'card' ? (
                <CardView
                    categories={filteredCategories}
                    hasAnyCategories={categories.length > 0}
                    onEditCategory={openEditModal}
                    onToggleStatus={setCategoryToToggle}
                />
            ) : (
                <TableView
                    categories={filteredCategories}
                    hasAnyCategories={categories.length > 0}
                    onEditCategory={openEditModal}
                    onToggleStatus={setCategoryToToggle}
                />
            )}

            <CategoryFormModal
                isOpen={showFormModal}
                category={editingCategory}
                onClose={() => setShowFormModal(false)}
                onSaved={fetchCategories}
            />

            {categoryToToggle && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
                    onClick={(e) => e.target === e.currentTarget && setCategoryToToggle(null)}
                >
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {categoryToToggle.isActive ? 'Disable' : 'Enable'} Category
                            </h2>
                            <button
                                onClick={() => setCategoryToToggle(null)}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200"
                                type="button"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-900 font-medium mb-2">
                                Are you sure you want to {categoryToToggle.isActive ? 'disable' : 'enable'} "{categoryToToggle.name}"?
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed mb-6">
                                {categoryToToggle.isActive
                                    ? 'It will no longer appear on the homepage or in the admin category dropdown for new menu items.'
                                    : 'It will become available again on the homepage and in the admin category dropdown.'}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setCategoryToToggle(null)}
                                    className="flex-1 px-4 py-3 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl font-medium transition-all duration-200 border border-gray-200"
                                    type="button"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmToggleStatus}
                                    className={`flex-1 px-4 py-3 text-white rounded-xl font-medium transition-all duration-200 shadow-sm ${categoryToToggle.isActive
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-emerald-600 hover:bg-emerald-700'
                                        }`}
                                    type="button"
                                >
                                    {categoryToToggle.isActive ? 'Disable' : 'Enable'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;
