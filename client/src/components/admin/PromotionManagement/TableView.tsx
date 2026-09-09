import React from 'react';
import { Edit, Power, PowerOff, Megaphone } from 'lucide-react';
import { Promotion } from '../../../types/menu';
import { getImageUrl } from '../../../utils/imageUrl';

interface TableViewProps {
    promotions: Promotion[];
    hasAnyPromotions: boolean;
    onEditPromotion: (promotion: Promotion) => void;
    onToggleStatus: (promotion: Promotion) => void;
}

const formatValidUntil = (validUntil?: string) => {
    if (!validUntil) return 'Ongoing';
    const date = new Date(validUntil);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

const TableView: React.FC<TableViewProps> = ({
    promotions,
    hasAnyPromotions,
    onEditPromotion,
    onToggleStatus
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-warm-brown-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-warm-brown-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promotion</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Badge</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {promotions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center">
                                    <div className="text-gray-500">
                                        <Megaphone size={48} className="mx-auto mb-4 opacity-50" />
                                        <p className="text-lg font-medium">{hasAnyPromotions ? 'No promotions found' : 'No promotions yet'}</p>
                                        <p className="text-sm">
                                            {hasAnyPromotions
                                                ? 'Try adjusting your search or filter criteria'
                                                : 'Click "Add New Promo" to create your first one'}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            promotions.map((promotion) => (
                                <tr
                                    key={promotion._id}
                                    onClick={() => onEditPromotion(promotion)}
                                    className={`hover:bg-gray-50 cursor-pointer ${promotion.isActive ? '' : 'opacity-60'}`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-12 w-12">
                                                {promotion.image ? (
                                                    <img
                                                        className="h-12 w-12 rounded-lg object-cover"
                                                        src={getImageUrl(promotion.image)}
                                                        alt={promotion.title}
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                                        <Megaphone size={20} className="text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{promotion.title}</div>
                                                <div className="text-sm text-gray-500 max-w-xs truncate">{promotion.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {promotion.badgeText ? (
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-warm-brown-100 text-warm-brown-700">
                                                {promotion.badgeText}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-gray-400">&mdash;</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatValidUntil(promotion.validUntil)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${promotion.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {promotion.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onEditPromotion(promotion); }}
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                title="Edit"
                                                type="button"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onToggleStatus(promotion); }}
                                                className={`p-2 rounded-lg transition-colors ${promotion.isActive
                                                    ? 'text-red-600 hover:bg-red-100'
                                                    : 'text-green-600 hover:bg-green-100'
                                                    }`}
                                                title={promotion.isActive ? 'Disable' : 'Enable'}
                                                type="button"
                                            >
                                                {promotion.isActive ? <PowerOff size={16} /> : <Power size={16} />}
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
