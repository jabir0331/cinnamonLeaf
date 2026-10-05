import React from 'react';
import { Edit, Power, PowerOff, Megaphone } from 'lucide-react';
import { Promotion } from '../../../types/menu';
import { getImageUrl } from '../../../utils/imageUrl';

interface CardViewProps {
    promotions: Promotion[];
    hasAnyPromotions: boolean;
    onEditPromotion: (promotion: Promotion) => void;
    onToggleStatus: (promotion: Promotion) => void;
}

const formatValidUntil = (validUntil?: string) => {
    if (!validUntil) return 'Ongoing';
    const date = new Date(validUntil);
    return `Valid until ${date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`;
};

const CardView: React.FC<CardViewProps> = ({
    promotions,
    hasAnyPromotions,
    onEditPromotion,
    onToggleStatus
}) => {
    if (promotions.length === 0) {
        return (
            <div className="col-span-full text-center py-16">
                <div className="bg-gradient-to-br from-cream-50 to-sage-green-50 rounded-2xl p-12 mx-auto max-w-lg">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-sage-green-200 to-warm-brown-200 rounded-full opacity-20 blur-xl"></div>
                        <Megaphone size={80} className="mx-auto mb-6 text-sage-green-400 relative z-10" />
                    </div>
                    <h3 className="text-xl font-display font-semibold text-gray-800 mb-2">
                        {hasAnyPromotions ? 'No promotions found' : 'No promotions yet'}
                    </h3>
                    <p className="text-sage-green-600 font-body">
                        {hasAnyPromotions
                            ? 'Try adjusting your search or filter criteria'
                            : 'Click "Add New Promo" to create your first one'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promotion) => (
                <div
                    key={promotion._id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                >
                    <div className="h-40 bg-gradient-to-br from-cream-100 to-sage-green-100 relative overflow-hidden">
                        {promotion.image ? (
                            <img src={getImageUrl(promotion.image)} alt={promotion.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-warm-brown-300 font-body text-sm">
                                No image
                            </div>
                        )}
                        {promotion.badgeText && (
                            <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-warm-brown-700 text-white shadow-md">
                                {promotion.badgeText}
                            </div>
                        )}
                        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${promotion.isActive
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                            }`}>
                            {promotion.isActive ? 'Active' : 'Inactive'}
                        </div>
                    </div>

                    <div className="p-5">
                        <h3 className="font-display text-lg font-semibold text-warm-brown-800 mb-2">{promotion.title}</h3>
                        <p className="text-sm text-warm-brown-600 font-body mb-2 line-clamp-2">{promotion.description}</p>
                        <p className="text-xs text-sage-green-600 font-body mb-4">{formatValidUntil(promotion.validUntil)}</p>

                        <div className="flex gap-2">
                            <button
                                onClick={() => onEditPromotion(promotion)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-warm-brown-50 hover:bg-warm-brown-100 text-warm-brown-700 rounded-lg font-body text-sm font-medium transition-colors"
                                type="button"
                            >
                                <Edit size={14} />
                                Edit
                            </button>
                            <button
                                onClick={() => onToggleStatus(promotion)}
                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-body text-sm font-medium transition-colors ${promotion.isActive
                                    ? 'bg-red-50 hover:bg-red-100 text-red-700'
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                                    }`}
                                type="button"
                            >
                                {promotion.isActive ? <PowerOff size={14} /> : <Power size={14} />}
                                {promotion.isActive ? 'Disable' : 'Enable'}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CardView;
