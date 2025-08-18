import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface CartButtonProps {
  itemCount: number;
  onClick: () => void;
}

const CartButton: React.FC<CartButtonProps> = ({ itemCount, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-4 z-50 bg-sage-green-600 hover:bg-sage-green-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 flex items-center gap-2"
    >
      <ShoppingCart size={20} />
      {itemCount > 0 && (
        <span className="bg-warm-brown-600 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
          {itemCount}
        </span>
      )}
    </button>
  );
};

export default CartButton;