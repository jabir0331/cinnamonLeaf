// src/pages/admin/MenuManagement.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus } from 'lucide-react';
import { Salad, ChefHat, IceCream, Coffee, Layout } from 'lucide-react';
import { getAllMenuItems, toggleMenuItemStatus } from '../../services/menuItems';
import { ApiMenuItem, MenuItem, MenuCategory, CategoryTab } from '../../types/menu';
import LoadingState from '../../components/LoadingState';
import CategoryTabs from '../../components/admin/MenuManagement/CategoryTabs';
import SearchBar from '../../components/admin/MenuManagement/SearchBar';
import ViewToggle from '../../components/admin/MenuManagement/ViewToggle';
import CardView from '../../components/admin/MenuManagement/CardView';
import TableView from '../../components/admin/MenuManagement/TableView';
import ConfirmationModal from '../../components/admin/MenuManagement/ConfirmationModal';
import AddItemModal from '../../components/admin/MenuManagement/AddItemModal';
import EditItemModal from '../../components/admin/MenuManagement/EditItemModal';
import DetailModal from '../../components/admin/MenuManagement/DetailModal';

const MenuManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState<string>(activeCategory);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [itemToToggle, setItemToToggle] = useState<MenuItem | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [menuData, setMenuData] = useState<Record<string, MenuCategory>>({});
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories: CategoryTab[] = [
    { id: 'All', label: 'All Items', icon: <Layout size={16} /> },
    { id: 'Starters', label: 'Starters', icon: <Salad size={16} /> },
    { id: 'Main Courses', label: 'Main Courses', icon: <ChefHat size={16} /> },
    { id: 'Desserts', label: 'Desserts', icon: <IceCream size={16} /> },
    { id: 'Beverages', label: 'Beverages', icon: <Coffee size={16} /> }
  ];

  const transformMenuData = (apiItems: ApiMenuItem[]): {
    categories: Record<string, MenuCategory>,
    allItems: MenuItem[]
  } => {
    const categories: Record<string, MenuCategory> = {
      starters: { title: "Starters", items: [] },
      mains: { title: "Main Courses", items: [] },
      desserts: { title: "Desserts", items: [] },
      drinks: { title: "Beverages", items: [] }
    };

    const allItems: MenuItem[] = [];

    apiItems.forEach(item => {
      let categoryKey = item.category.toLowerCase();

      if (categoryKey.includes('main') || categoryKey.includes('mains')) {
        categoryKey = 'mains';
      } else if (categoryKey.includes('starter')) {
        categoryKey = 'starters';
      } else if (categoryKey.includes('dessert')) {
        categoryKey = 'desserts';
      } else if (categoryKey.includes('drink') || categoryKey.includes('beverage')) {
        categoryKey = 'drinks';
      } else {
        categoryKey = 'starters';
      }

      const menuItem: MenuItem = {
        _id: item._id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        category: categories[categoryKey]?.title || 'Starters',
        spicy: item.spicy,
        vegetarian: item.vegetarian,
        popular: item.popular,
        status: item.status === 'Available' ? 'Available' : 'Unavailable',
        updatedAt: item.updatedAt
      };

      if (categories[categoryKey]) {
        categories[categoryKey].items.push(menuItem);
      }

      allItems.push(menuItem);
    });

    return { categories, allItems };
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        console.log('Fetching menu items...');
        const data = await getAllMenuItems();
        console.log('API response:', data);

        if (data.success) {
          console.log('Menu items received:', data.menuItems);
          const { categories: transformedCategories, allItems } = transformMenuData(data.menuItems);
          console.log('Transformed data:', transformedCategories);
          console.log('All items:', allItems);
          setMenuData(transformedCategories);
          setAllMenuItems(allItems);
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

  const filteredItems = allMenuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItemStatus = (itemId: string): void => {
    const item = allMenuItems.find(i => i._id === itemId);
    if (item) {
      setItemToToggle(item);
      setShowConfirmModal(true);
    }
  };

  // In MenuManagement.tsx, replace the confirmToggleStatus function with:
  const confirmToggleStatus = async (itemId: string): Promise<void> => {
    try {
      // Call your API to update the status in the backend
      const response = await toggleMenuItemStatus(itemId);

      if (response.success) { // Remove .data from response.data.success
        // Update local state only after successful API call
        setAllMenuItems(prevItems =>
          prevItems.map(item =>
            item._id === itemId
              ? {
                ...item,
                status: item.status === 'Available' ? 'Unavailable' : 'Available'
              }
              : item
          )
        );

        setMenuData(prevData => {
          const newData = { ...prevData };
          Object.keys(newData).forEach(categoryKey => {
            newData[categoryKey] = {
              ...newData[categoryKey],
              items: newData[categoryKey].items.map(item =>
                item._id === itemId
                  ? {
                    ...item,
                    status: item.status === 'Available' ? 'Unavailable' : 'Available'
                  }
                  : item
              )
            };
          });
          return newData;
        });

        if (showDetailModal && selectedItem?._id === itemId) {
          setShowDetailModal(false);
        }

        toast.success(`Item ${itemToToggle?.status === 'Available' ? 'disabled' : 'enabled'} successfully`);
      } else {
        toast.error('Failed to update item status');
      }
    } catch (error) {
      console.error('Error toggling item status:', error);
      toast.error('Failed to update item status');
    } finally {
      setShowConfirmModal(false);
      setItemToToggle(null);
    }
  };

  const openEditModal = (item: MenuItem): void => {
    setSelectedItem(item);
    setShowDetailModal(false);
    
    setTimeout(() => {
      setShowEditModal(true); // Open the edit modal
    }, 100);

  };

  const handleSaveItem = (updatedItem: MenuItem): void => {
    // Update allMenuItems
    setAllMenuItems(prevItems =>
      prevItems.map(item =>
        item._id === updatedItem._id ? updatedItem : item
      )
    );

    // Update menuData
    setMenuData(prevData => {
      const newData = { ...prevData };
      Object.keys(newData).forEach(categoryKey => {
        newData[categoryKey] = {
          ...newData[categoryKey],
          items: newData[categoryKey].items.map(item =>
            item._id === updatedItem._id ? updatedItem : item
          )
        };
      });
      return newData;
    });

    // Close modal and show success message
    setShowEditModal(false);
    setSelectedItem(null);
    toast.success('Menu item updated successfully!');
  };

  const openDetailModal = (item: MenuItem): void => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const nextSibling = target.nextElementSibling as HTMLElement;
    if (nextSibling) {
      nextSibling.classList.remove('hidden');
    }
  };

  const handleCategoryChange = (categoryId: string): void => {
    setActiveCategory(categoryId);
    setSelectedCategory(categoryId);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        isLoading={isLoading}
        onCategoryChange={handleCategoryChange}
      />

      <div className="flex flex-col lg:flex-row gap-4">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <div className="flex items-center gap-2">
          <ViewToggle
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-sage-green-500 text-white px-4 py-2 rounded-lg hover:bg-sage-green-600 transition-colors"
            type="button"
          >
            <Plus size={20} />
            <span>Add New Menu Item</span>
          </button>
        </div>
      </div>

      {viewMode === 'card' ? (
        <CardView
          items={filteredItems}
          onViewDetails={openDetailModal}
          onEditItem={openEditModal}
          onToggleStatus={toggleItemStatus}
          onImageError={handleImageError}
        />
      ) : (
        <TableView
          items={filteredItems}
          onViewDetails={openDetailModal}
          onEditItem={openEditModal}
          onToggleStatus={toggleItemStatus}
          onImageError={handleImageError}
        />
      )}

      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onItemAdded={() => {
          // Refresh the menu items after adding a new one
          const fetchMenuItems = async () => {
            try {
              setIsLoading(true);
              const data = await getAllMenuItems();
              if (data.success) {
                const { categories: transformedCategories, allItems } = transformMenuData(data.menuItems);
                setMenuData(transformedCategories);
                setAllMenuItems(allItems);
              }
            } catch (error) {
              console.error('Error refreshing menu items:', error);
            } finally {
              setIsLoading(false);
            }
          };
          fetchMenuItems();
        }}
      />

      <EditItemModal
        isOpen={showEditModal}
        item={selectedItem}
        onClose={() => {
          setShowEditModal(false);
          setSelectedItem(null);
        }}
        onSave={handleSaveItem}
      />

      <DetailModal
        isOpen={showDetailModal}
        item={selectedItem}
        onClose={() => setShowDetailModal(false)}
        onEditItem={openEditModal}
        onToggleStatus={toggleItemStatus}
        onImageError={handleImageError}
      />

      {/* This is to get confirmation from user when enabling or disabling an item from placing orders*/}
      <ConfirmationModal
        isOpen={showConfirmModal}
        item={itemToToggle}
        onClose={() => {
          setShowConfirmModal(false);
          setItemToToggle(null);
        }}
        onConfirm={confirmToggleStatus}
      />
    </div>
  );
};

export default MenuManagement;