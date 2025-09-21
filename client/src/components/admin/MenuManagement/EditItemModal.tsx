import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Save, RotateCcw, Salad, Flame, Crown } from 'lucide-react';
import { MenuItem } from '../../../types/menu';
import {updateMenuItem} from "../../../services/menuItems";
import {toast} from 'react-toastify';

interface EditItemModalProps {
    isOpen: boolean;
    item: MenuItem | null;
    onClose: () => void;
    onSave: (updatedItem: MenuItem) => void;
}

const EditItemModal: React.FC<EditItemModalProps> = ({
    isOpen,
    item,
    onClose,
    onSave
}) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        price: '',
        image: '',
        vegetarian: false,
        spicy: false,
        popular: false
    });
    const [previewImage, setPreviewImage] = useState<string>('');
    const [dragActive, setDragActive] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize form data when item changes
    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name || '',
                category: item.category || '',
                description: item.description || '',
                price: item.price || '',
                image: item.image || '',
                vegetarian: item.vegetarian || false,
                spicy: item.spicy || false,
                popular: item.popular || false
            });
            setPreviewImage(item.image || '');
            setHasChanges(false);
        }
    }, [item]);

    if (!isOpen || !item) return null;

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleFileChange = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target?.result as string;
                setPreviewImage(imageUrl);
                handleInputChange('image', imageUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    const handleReset = () => {
        if (item) {
            setFormData({
                name: item.name || '',
                category: item.category || '',
                description: item.description || '',
                price: item.price || '',
                image: item.image || '',
                vegetarian: item.vegetarian || false,
                spicy: item.spicy || false,
                popular: item.popular || false
            });
            setPreviewImage(item.image || '');
            setHasChanges(false);
        }
    };

    const handleSave = async () => {
        try {
            const formDataToSend = new FormData();

            // Append all form data
            formDataToSend.append('name', formData.name);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('vegetarian', formData.vegetarian.toString());
            formDataToSend.append('spicy', formData.spicy.toString());
            formDataToSend.append('popular', formData.popular.toString());

            // If image is a new file (base64 string), convert it to a file
            if (formData.image && formData.image.startsWith('data:image')) {
                const response = await fetch(formData.image);
                const blob = await response.blob();
                const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
                formDataToSend.append('image', file);
            }

            // Call the update API
            const response = await updateMenuItem(item._id, formDataToSend);

            if (response.success) {
                const updatedItem: MenuItem = {
                    ...item,
                    ...formData,
                    // Use the image URL from response if available
                    image: response.menuItem?.image || formData.image
                };

                onSave(updatedItem);
                setHasChanges(false);
                toast.success('Menu item updated successfully!');
            }
        } catch (error) {
            console.error('Error updating menu item:', error);
            toast.error('Failed to update menu item');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-5 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-warm-brown-50 via-cream-50 to-sage-green-50 px-8 py-6 border-b border-warm-brown-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-3xl font-display font-bold text-warm-brown-800 mb-1">Edit Menu Item</h3>
                            <p className="text-sage-green-600 font-body">Update your menu item details and settings</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {hasChanges && (
                                <div className="flex items-center text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full text-sm font-medium">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
                                    Unsaved changes
                                </div>
                            )}
                            <button
                                onClick={onClose}
                                className="group p-3 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-2xl transition-all duration-200 hover:scale-110"
                                type="button"
                            >
                                <X size={24} className="group-hover:rotate-90 transition-transform duration-200" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-8 overflow-y-auto max-h-[calc(95vh-120px)]">
                    <div className="max-w-2xl mx-auto space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h4 className="text-lg font-display font-semibold text-warm-brown-800 mb-6">Basic Information</h4>
                            <div className="space-y-6">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-2 font-body">Item Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            className="w-full px-4 py-3 border border-warm-brown-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green-500 focus:border-transparent transition-all font-body"
                                            placeholder="Enter item name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-2 font-body">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => handleInputChange('category', e.target.value)}
                                            className="w-full px-4 py-3 border border-warm-brown-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green-500 focus:border-transparent transition-all font-body bg-white"
                                        >
                                            <option selected disabled>Select category</option>
                                            <option value="Starters">Starters</option>
                                            <option value="Main Courses">Main Courses</option>
                                            <option value="Desserts">Desserts</option>
                                            <option value="Beverages">Beverages</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-2 font-body">Description</label>
                                    <textarea
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        className="w-full px-4 py-3 border border-warm-brown-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green-500 focus:border-transparent transition-all font-body resize-none"
                                        placeholder="Describe your delicious item..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-2 font-body">Price</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">LKR</span>
                                        <input
                                            type="text"
                                            value={formData.price}
                                            onChange={(e) => handleInputChange('price', e.target.value)}
                                            className="w-full pl-16 pr-4 py-3 border border-warm-brown-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green-500 focus:border-transparent transition-all font-body"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-3 font-body">Item Image</label>
                                    <div
                                        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${dragActive
                                                ? 'border-sage-green-400 bg-sage-green-50'
                                                : 'border-warm-brown-300 hover:border-sage-green-400'
                                            }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                                            className="hidden"
                                        />
                                        {previewImage ? (
                                            <div className="space-y-4">
                                                <div className="relative mx-auto w-48 h-48 rounded-xl overflow-hidden shadow-lg">
                                                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setPreviewImage('');
                                                            handleInputChange('image', '');
                                                        }}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="text-sage-green-600 hover:text-sage-green-700 font-medium"
                                                >
                                                    Change Image
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="mx-auto w-16 h-16 bg-sage-green-100 rounded-2xl flex items-center justify-center">
                                                    <Upload size={32} className="text-sage-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-medium text-gray-900 mb-1">
                                                        Drop your image here, or{' '}
                                                        <button
                                                            type="button"
                                                            onClick={() => fileInputRef.current?.click()}
                                                            className="text-sage-green-600 hover:text-sage-green-700 underline"
                                                        >
                                                            browse
                                                        </button>
                                                    </p>
                                                    <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Additional Options */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h4 className="text-lg font-display font-semibold text-warm-brown-800 mb-4">Additional Options</h4>
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-4">
                                    <label className="flex items-center bg-green-50 border border-green-200 px-4 py-3 rounded-xl cursor-pointer hover:bg-green-100 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={formData.vegetarian}
                                            onChange={(e) => handleInputChange('vegetarian', e.target.checked)}
                                            className="w-4 h-4 text-green-600 border-green-300 rounded focus:ring-green-500 mr-3"
                                        />
                                        <div className="flex items-center">
                                            <span className="text-green-500 mr-2"><Salad size={20} /></span>
                                            <span className="text-sm font-medium text-green-800">Vegetarian</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center bg-red-50 border border-red-200 px-4 py-3 rounded-xl cursor-pointer hover:bg-red-100 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={formData.spicy}
                                            onChange={(e) => handleInputChange('spicy', e.target.checked)}
                                            className="w-4 h-4 text-red-600 border-red-300 rounded focus:ring-red-500 mr-3"
                                        />
                                        <div className="flex items-center">
                                            <span className="text-red-500 mr-2"><Flame size={20} /></span>
                                            <span className="text-sm font-medium text-red-800">Spicy</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center bg-orange-50 border border-orange-200 px-4 py-3 rounded-xl cursor-pointer hover:bg-orange-100 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={formData.popular}
                                            onChange={(e) => handleInputChange('popular', e.target.checked)}
                                            className="w-4 h-4 text-orange-600 border-orange-300 rounded focus:ring-orange-500 mr-3"
                                        />
                                        <div className="flex items-center">
                                            <Crown size={20} className="text-orange-500 mr-2" />
                                            <span className="text-sm font-medium text-orange-800">Popular Item</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                        <button
                            onClick={handleReset}
                            disabled={!hasChanges}
                            className={`flex flex-1 items-center justify-center gap-3 px-6 py-4 rounded-2xl transition-all duration-200 font-medium ${hasChanges
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300'
                                    : 'bg-gray-50 text-gray-400 border-2 border-gray-200 cursor-not-allowed'
                                }`}
                            type="button"
                        >
                            <RotateCcw size={20} />
                            Reset Changes
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={!hasChanges}
                            className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl transition-all duration-200 shadow-lg font-medium ${hasChanges
                                    ? 'bg-gradient-to-r from-sage-green-500 to-sage-green-600 text-white hover:from-sage-green-600 hover:to-sage-green-700 hover:scale-[1.02]'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            type="button"
                        >
                            <Save size={20} />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditItemModal;