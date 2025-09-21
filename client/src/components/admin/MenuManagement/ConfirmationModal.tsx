import React from 'react';
import { Power, PowerOff, X, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  item: {
    _id: string;
    name: string;
    status: 'Unavailable' | 'Available';
  } | null;
  onClose: () => void;
  onConfirm: (itemId: string) => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  item,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !item) return null;

  const isEnabling = item.status === 'Unavailable';
  const actionText = isEnabling ? 'Enable' : 'Disable';
  const description = isEnabling 
    ? `This will mark "${item.name}" as available for online orders and customers will be able to purchase this item.`
    : `This will mark "${item.name}" as unavailable for online orders and customers won't be able to purchase this item.`;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isEnabling 
              ? 'bg-emerald-50 text-emerald-600' 
              : 'bg-red-50 text-red-600'
            }`}>
              {isEnabling ? <Power size={20} /> : <PowerOff size={20} />}
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              {actionText} Menu Item
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200"
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">

          {/* Confirmation text */}
          <div className="mb-6">
            <p className="text-gray-900 font-medium mb-2">
              Are you sure you want to {actionText.toLowerCase()} this item?
            </p>
            <p className="text-sm text-gray-600 leading-relaxed text-justify">
              {description}
            </p>
          </div>

          {/* Item info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                item.status === 'Available' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {item.status}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl font-medium transition-all duration-200 border border-gray-200"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(item._id)}
              className={`flex-1 px-4 py-3 text-white rounded-xl font-medium transition-all duration-200 shadow-sm ${
                isEnabling 
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 hover:shadow-emerald-500/30' 
                  : 'bg-red-600 hover:bg-red-700 shadow-red-500/20 hover:shadow-red-500/30'
              }`}
              type="button"
            >
              {actionText} Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;