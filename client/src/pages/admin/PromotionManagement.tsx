// src/pages/admin/PromotionManagement.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus, X } from 'lucide-react';
import { getAllPromotions, togglePromotionStatus } from '../../services/promotions';
import { Promotion } from '../../types/menu';
import LoadingState from '../../components/LoadingState';
import SearchBar from '../../components/admin/MenuManagement/SearchBar';
import ViewToggle from '../../components/admin/MenuManagement/ViewToggle';
import CardView from '../../components/admin/PromotionManagement/CardView';
import TableView from '../../components/admin/PromotionManagement/TableView';
import PromotionFormModal from '../../components/admin/PromotionManagement/PromotionFormModal';

const PromotionManagement: React.FC = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
    const [promotionToToggle, setPromotionToToggle] = useState<Promotion | null>(null);

    const fetchPromotions = async () => {
        try {
            const data = await getAllPromotions();
            if (data.success) {
                setPromotions(data.promotions);
            } else {
                toast.error(data.message || 'Failed to fetch promotions');
            }
        } catch (error) {
            console.error('Error fetching promotions:', error);
            toast.error('Failed to fetch promotions');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    useEffect(() => {
        const isAnyModalOpen = showFormModal || !!promotionToToggle;
        document.body.style.overflow = isAnyModalOpen ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showFormModal, promotionToToggle]);

    const filteredPromotions = promotions.filter((promotion) => {
        const term = searchTerm.toLowerCase();
        return (
            promotion.title.toLowerCase().includes(term) ||
            promotion.description.toLowerCase().includes(term)
        );
    });

    const openAddModal = () => {
        setEditingPromotion(null);
        setShowFormModal(true);
    };

    const openEditModal = (promotion: Promotion) => {
        setEditingPromotion(promotion);
        setShowFormModal(true);
    };

    const confirmToggleStatus = async () => {
        if (!promotionToToggle) return;
        try {
            const response = await togglePromotionStatus(promotionToToggle._id);
            if (response.success) {
                setPromotions(prev =>
                    prev.map(p => p._id === promotionToToggle._id ? { ...p, isActive: !p.isActive } : p)
                );
                toast.success(`Promotion ${promotionToToggle.isActive ? 'disabled' : 'enabled'} successfully`);
            } else {
                toast.error('Failed to update promotion status');
            }
        } catch (error) {
            console.error('Error toggling promotion status:', error);
            toast.error('Failed to update promotion status');
        } finally {
            setPromotionToToggle(null);
        }
    };

    if (isLoading) {
        return <LoadingState message="Loading promotions..." subMessage="Fetching promotion details, please wait a moment" />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4">
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder="Search promotions..."
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
                        <span>Add New Promotion</span>
                    </button>
                </div>
            </div>

            {viewMode === 'card' ? (
                <CardView
                    promotions={filteredPromotions}
                    hasAnyPromotions={promotions.length > 0}
                    onEditPromotion={openEditModal}
                    onToggleStatus={setPromotionToToggle}
                />
            ) : (
                <TableView
                    promotions={filteredPromotions}
                    hasAnyPromotions={promotions.length > 0}
                    onEditPromotion={openEditModal}
                    onToggleStatus={setPromotionToToggle}
                />
            )}

            <PromotionFormModal
                isOpen={showFormModal}
                promotion={editingPromotion}
                onClose={() => setShowFormModal(false)}
                onSaved={fetchPromotions}
            />

            {promotionToToggle && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
                    style={{ top: '-5rem', height: 'calc(100vh + 5rem)' }}
                    onClick={(e) => e.target === e.currentTarget && setPromotionToToggle(null)}
                >
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 mt-7">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {promotionToToggle.isActive ? 'Disable' : 'Enable'} Promotion
                            </h2>
                            <button
                                onClick={() => setPromotionToToggle(null)}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200"
                                type="button"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-900 font-medium mb-2">
                                Are you sure you want to {promotionToToggle.isActive ? 'disable' : 'enable'} "{promotionToToggle.title}"?
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed mb-6">
                                {promotionToToggle.isActive
                                    ? 'It will no longer appear on the customer-facing promotions page.'
                                    : 'It will become visible again on the customer-facing promotions page.'}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setPromotionToToggle(null)}
                                    className="flex-1 px-4 py-3 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl font-medium transition-all duration-200 border border-gray-200"
                                    type="button"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmToggleStatus}
                                    className={`flex-1 px-4 py-3 text-white rounded-xl font-medium transition-all duration-200 shadow-sm ${promotionToToggle.isActive
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-emerald-600 hover:bg-emerald-700'
                                        }`}
                                    type="button"
                                >
                                    {promotionToToggle.isActive ? 'Disable' : 'Enable'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromotionManagement;
