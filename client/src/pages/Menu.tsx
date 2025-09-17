import React, { useState, useRef, useEffect } from 'react';
import { Salad, ChefHat, IceCream, Coffee, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useCart } from '../hooks/useCart';
import CartButton from '../components/CartButton';
import Cart from '../components/Cart';
import CheckoutModal from '../components/CheckoutModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { DeliveryInfo } from '../types/cart';
import { getAllMenuItems } from '../services/menuItems';
import { saveOrder } from "../services/order";
import { createCheckoutSession } from '../services/api';

interface ApiMenuItem {
  _id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  spicy?: boolean;
  vegetarian?: boolean;
  popular?: boolean;
}

interface MenuItem {
  name: string;
  description: string;
  price: string;
  image: any; // Imported image module
  spicy?: boolean;
  vegetarian?: boolean;
  popular?: boolean;
}

interface MenuCategory {
  title: string;
  items: MenuItem[];
}

const Menu: React.FC = () => {

  const [menuData, setMenuData] = useState<Record<string, MenuCategory>>({});
  const [isLoading, setIsLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState('starters');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Add refs to prevent duplicate toasts
  const toastIdRef = useRef<any>(null);
  const isProcessingOrder = useRef(false);

  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  } = useCart();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        console.log('Fetching menu items...');
        const data = await getAllMenuItems();
        console.log('API response:', data);

        if (data.success) {
          console.log('Menu items received:', data.menuItems);
          const transformedData = transformMenuData(data.menuItems);
          console.log('Transformed data:', transformedData);
          setMenuData(transformedData);
        } else {
          console.error('API error:', data.message);
          toast.error(data.message || 'Failed to fetch menu items');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to fetch menu items');
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);

      }
    };

    fetchMenuItems();
  }, []);

  // Helper function to transform API data to component format
  const transformMenuData = (apiItems: ApiMenuItem[]): Record<string, MenuCategory> => {
    const categories: Record<string, MenuCategory> = {
      starters: { title: "Starters", items: [] },
      mains: { title: "Main Courses", items: [] },
      desserts: { title: "Desserts", items: [] },
      drinks: { title: "Beverages", items: [] }
    };

    apiItems.forEach(item => {
      // Map API category names to your frontend category keys
      let categoryKey = item.category.toLowerCase();

      // Handle category mapping if needed
      if (categoryKey.includes('main') || categoryKey.includes('mains')) {
        categoryKey = 'mains';
      } else if (categoryKey.includes('starters')) {
        categoryKey = 'starters';
      } else if (categoryKey.includes('desserts')) {
        categoryKey = 'desserts';
      } else if (categoryKey.includes('drink') || categoryKey.includes('beverages')) {
        categoryKey = 'drinks';
      }

      if (categories[categoryKey]) {

        categories[categoryKey].items.push({
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image, // Fallback if image not found
          spicy: item.spicy,
          vegetarian: item.vegetarian,
          popular: item.popular
        });
      }
    });

    return categories;
  };

  const categories = [
    { id: 'starters', label: 'Starters', icon: <Salad size={16} /> },
    { id: 'mains', label: 'Main Courses', icon: <ChefHat size={16} /> },
    { id: 'desserts', label: 'Desserts', icon: <IceCream size={16} /> },
    { id: 'drinks', label: 'Beverages', icon: <Coffee size={16} /> }
  ];

  const handleAddToCart = (item: MenuItem, category: string) => {
    const cartItem = {
      id: `${category}-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: item.name,
      price: parseInt(item.price.replace('LKR ', '').replace(',', '')),
      image: item.image,
      category
    };

    // Check if item already exists in cart
    const existingItem = cartItems.find(existingCartItem => existingCartItem.id === cartItem.id);

    addToCart(cartItem);

    // Dismiss all existing toasts and show appropriate message
    toast.dismiss();
    setTimeout(() => {
      if (existingItem) {
        toastIdRef.current = toast.success(`${item.name} quantity updated!`);
      } else {
        toastIdRef.current = toast.success(`${item.name} added to cart!`);
      }
    }, 100);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);

    const token = localStorage.getItem('token');
    if(!token)
      toastIdRef.current = toast.error(`Please Login to proceed to checkout`);
    else
      setIsCheckoutOpen(true);
  };

  const handleConfirmOrder = async (deliveryInfo: DeliveryInfo, paymentMethod: 'cod' | 'card') => {
    // Prevent duplicate order processing
    if (isProcessingOrder.current) return;
    isProcessingOrder.current = true;

    // Generate ONE order number that will be used for both database and Stripe
    const newOrderNumber = "ORD-" + uuidv4().substring(0, 8).toUpperCase();

    // Prepare order payload
    const orderData = {
      orderNumber: newOrderNumber,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category,
        image: item.image // save image URL/path
      })),
      deliveryInfo,
      totalAmount: getTotalPrice(),
      paymentMethod,
      paymentStatus: 'pending'
    };

    try {
      // Save to backend with the same order number
      await saveOrder(orderData);
      console.log("Order saved successfully with order number:", newOrderNumber);
    } catch (err) {
      toast.error("Please login to create & track orders");
      isProcessingOrder.current = false;
      return;
    }

    if (paymentMethod === 'card') {
      setIsCheckoutOpen(false);

      try {
        // Show loading toast
        const loadingToast = toast.loading('Processing payment...');

        // Create checkout session with the SAME order number
        const response = await createCheckoutSession({
          items: cartItems,
          deliveryInfo: deliveryInfo,
          totalAmount: getTotalPrice(),
          orderNumber: newOrderNumber // Pass the same order number to Stripe
        });

        // Dismiss loading toast
        toast.dismiss(loadingToast);

        if (response.success && response.checkoutUrl) {
          // Clear cart before redirecting
          clearCart();

          // Redirect to Stripe checkout
          window.location.href = response.checkoutUrl;
        } else {
          throw new Error('Invalid response from server');
        }

      } catch (error) {
        console.error('Stripe checkout error:', error);
        toast.error(error instanceof Error ? error.message : 'Payment setup failed. Please try again.');
        setIsCheckoutOpen(true); // Reopen checkout modal
      }

      isProcessingOrder.current = false;
      return;
    }
    else {
      // Handle COD order
      setOrderNumber(newOrderNumber);
      setIsCheckoutOpen(false);
      setIsConfirmationOpen(true);
      clearCart();

      // Dismiss all toasts and show success message
      toast.dismiss();
      setTimeout(() => {
        toastIdRef.current = toast.success('Order confirmed! We\'ll call you shortly.');
      }, 100);
    }

    // Reset processing flag after a delay
    setTimeout(() => {
      isProcessingOrder.current = false;
    }, 1000);
  };
  // This is to hide the scroll bar when the cart is popped up
  useEffect(() => {
    if (isCartOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isCartOpen]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cream-50 via-warm-brown-50 to-sage-green-50 p-6">
        <div className="relative mb-8">
          <div className="w-16 h-16 border-4 border-warm-brown-200 border-t-warm-brown-600 rounded-full animate-spin shadow-lg"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-sage-green-400 rounded-full animate-spin animate-reverse" style={{ animationDuration: '1.5s' }}></div>
        </div>
        <div className="text-center">
          <p className="mt-6 text-warm-brown-700 font-display text-2xl font-semibold">Loading menu details...</p>
          <p className="mt-2 text-warm-brown-500 font-body text-base">Fetching the menu details, please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div>

      {/* Cart Button */}
      <CartButton
        itemCount={getTotalItems()}
        onClick={() => setIsCartOpen(true)}
      />

      {/* Cart Sidebar */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
        totalPrice={getTotalPrice()}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onConfirm={handleConfirmOrder}
        totalPrice={getTotalPrice()}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        orderNumber={orderNumber}
        estimatedDelivery="30-45 minutes"
      />

      {/* Menu Navigation */}
      <section className="sticky top-15 md:top-20 z-40 bg-cream-50 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-brown-700 mb-4">
            Our Menu
          </h2>
          <p className="font-body text-lg text-warm-brown-600 max-w-7xl mb-8">
            Discover our carefully crafted dishes that blend authentic flavors with creative innovation,
            using only the freshest seasonal ingredients.
          </p>

          <div className="mb-6">
            <div className="flex gap-1 bg-warm-brown-100 rounded-xl p-1.5 mb-5 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => !isLoading && setActiveCategory(category.id)}
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
                  {/* Add icon if you have one */}
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
        </div>
      </section>


      {/* Menu Content */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {menuData[activeCategory] ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <h2 className="font-display text-3xl font-bold text-warm-brown-700 mb-10 text-center">
                {menuData[activeCategory].title}
              </h2>

              <div className="space-y-8">
                {menuData[activeCategory].items.map((item, index) => (
                  <div key={index} className="border-b border-cream-200 pb-6 last:border-b-0">
                    <div className="flex gap-6">
                      {/* Food Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg shadow-md"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>

                      {/* Food Details */}
                      <div className="flex-1 min-w-0">
                        {/* Header with name and badges */}
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-body text-xl font-semibold text-warm-brown-700">
                              {item.name}
                            </h3>
                            <div className="flex space-x-2">
                              {item.popular && (
                                <span className="bg-sage-green-100 text-sage-green-700 text-xs px-2 py-1 rounded-full font-medium">
                                  Popular
                                </span>
                              )}
                              {item.spicy && (
                                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                                  Spicy
                                </span>
                              )}
                              {item.vegetarian && (
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                                  Vegetarian
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Price */}
                          <div className="mb-3">
                            <span className="font-body text-lg font-semibold text-sage-green-600">
                              {item.price}
                            </span>
                          </div>
                        </div>

                        {/* Description and Add to Cart Button - Now parallel */}
                        <div className="flex justify-between items-start gap-4">
                          <p className="font-body text-warm-brown-600 leading-relaxed flex-1">
                            {item.description}
                          </p>

                          {/* Add to Cart Button - Now parallel to description */}
                          <div className="flex-shrink-0">
                            <button
                              onClick={() => handleAddToCart(item, activeCategory)}
                              className="bg-sage-green-600 hover:bg-sage-green-700 text-white font-body font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
                            >
                              <Plus size={16} />
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
              <h2 className="font-display text-3xl font-bold text-warm-brown-700 mb-10">
                No Menu Items Available
              </h2>
              <p className="text-warm-brown-600">
                We're having trouble loading our menu. Please try again later.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Menu;