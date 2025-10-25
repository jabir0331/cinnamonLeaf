import React, { useState, useRef } from 'react';
import { X, Upload, Plus, Salad, Crown, Flame } from 'lucide-react';
import { createMenuItem } from '../../../services/menuItems';
import { toast } from 'react-toastify';

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onItemAdded?: () => void;
}

interface FormDataState {
    name: string;
    description: string;
    category: string;
    price: string;
    image: File | string;
    spicy: boolean;
    vegetarian: boolean;
    popular: boolean;
}

const AddItemModal: React.FC<AddItemModalProps> = ({
    isOpen,
    onClose,
    onItemAdded
}) => {
    const [previewImage, setPreviewImage] = useState<string>('');
    const [dragActive, setDragActive] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [formData, setFormData] = useState<FormDataState>({
        name: '',
        description: '',
        category: '',
        price: '',
        image: '',
        spicy: false,
        vegetarian: false,
        popular: false
    });

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleFileChange = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            // Store the file object in formData
            setFormData(prev => ({
                ...prev,
                image: file
            }));
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validate required fields manually
            if (!formData.name || !formData.description || !formData.category || !formData.price || !formData.image) {
                toast.error('Please fill in all required fields');
                setIsSubmitting(false);
                return;
            }

            // Create FormData object for file upload
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('description', formData.description);
            submitData.append('category', formData.category);
            submitData.append('price', formData.price);
            submitData.append('spicy', formData.spicy.toString());
            submitData.append('vegetarian', formData.vegetarian.toString());
            submitData.append('popular', formData.popular.toString());

            // If image is a file, append it
            if (formData.image instanceof File) {
                submitData.append('image', formData.image);
            } else if (typeof formData.image === 'string' && formData.image.startsWith('data:image')) {
                // Convert base64 to blob if needed
                const response = await fetch(formData.image);
                const blob = await response.blob();
                submitData.append('image', blob, 'image.png');
            }

            const response = await createMenuItem(submitData);

            if (response.success) {
                toast.success('Menu item created successfully!');
                resetForm();
                onClose();
                if (onItemAdded) {
                    onItemAdded();
                }
            } else {
                toast.error(response.message || 'Failed to create menu item');
            }
        } catch (error: any) {
            console.error('Error creating menu item:', error);
            toast.error(error.response?.data?.message || 'Failed to create menu item');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            category: '',
            price: '',
            image: '',
            spicy: false,
            vegetarian: false,
            popular: false
        });
        setPreviewImage('');
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

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-5 animate-in fade-in duration-200" style={{ top: '-5rem', height: 'calc(100vh + 5rem)' }}>
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300 mt-7">
                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-warm-brown-50 via-cream-50 to-sage-green-50 px-8 py-6 border-b border-warm-brown-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-3xl font-display font-bold text-warm-brown-800 mb-1">Add New Menu Item</h3>
                                <p className="text-sage-green-600 font-body">Create a delicious new addition to your menu</p>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="group p-3 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-2xl transition-all duration-200 hover:scale-110"
                            >
                                <X size={24} className="group-hover:rotate-90 transition-transform duration-200" />
                            </button>
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
                                            <label className="block text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-2 font-body">Item Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-warm-brown-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green-500 focus:border-transparent transition-all font-body"
                                                placeholder="Enter item name"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-2 font-body">Category *</label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-warm-brown-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green-500 focus:border-transparent transition-all font-body bg-white"
                                                required
                                            >
                                                <option value="">Select category</option>
                                                <option value="Starters">Starters</option>
                                                <option value="Main Courses">Main Courses</option>
                                                <option value="Desserts">Desserts</option>
                                                <option value="Beverages">Beverages</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-2 font-body">Description *</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-4 py-3 border border-warm-brown-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green-500 focus:border-transparent transition-all font-body resize-none"
                                            placeholder="Describe your delicious item..."
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-2 font-body">Price *</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">LKR</span>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                step="0.01"
                                                min="0"
                                                className="w-full pl-16 pr-4 py-3 border border-warm-brown-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green-500 focus:border-transparent transition-all font-body"
                                                placeholder="0.00"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Image Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-3 font-body">Item Image *</label>
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
                                                name="image"
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
                                                                setFormData(prev => ({ ...prev, image: '' }));
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
                                                        <Upload size={32} className="text-sage-green-600 cursor-pointer" onClick={() => fileInputRef.current?.click()} />
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-medium text-gray-900 mb-1">
                                                            Drop your image here, or{' '}
                                                            <button
                                                                type="button"
                                                                onClick={() => fileInputRef.current?.click()}
                                                                className="text-sage-green-600 hover:text-sage-green-700"
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
                                                name="vegetarian"
                                                checked={formData.vegetarian}
                                                onChange={handleCheckboxChange}
                                                className="w-4 h-4 text-green-600 border-green-300 rounded focus:ring-green-500 mr-3"
                                            />
                                            <div className="flex items-center">
                                                <span className="text-green-500 mr-2"><Salad size={16} /></span>
                                                <span className="text-sm font-medium text-green-800">Vegetarian</span>
                                            </div>
                                        </label>
                                        <label className="flex items-center bg-red-50 border border-red-200 px-4 py-3 rounded-xl cursor-pointer hover:bg-red-100 transition-colors">
                                            <input
                                                type="checkbox"
                                                name="spicy"
                                                checked={formData.spicy}
                                                onChange={handleCheckboxChange}
                                                className="w-4 h-4 text-red-600 border-red-300 rounded focus:ring-red-500 mr-3"
                                            />
                                            <div className="flex items-center">
                                                <span className="text-red-500 mr-2"><Flame size={16} /></span>
                                                <span className="text-sm font-medium text-red-800">Spicy</span>
                                            </div>
                                        </label>
                                        <label className="flex items-center bg-orange-50 border border-orange-200 px-4 py-3 rounded-xl cursor-pointer hover:bg-orange-100 transition-colors">
                                            <input
                                                type="checkbox"
                                                name="popular"
                                                checked={formData.popular}
                                                onChange={handleCheckboxChange}
                                                className="w-4 h-4 text-orange-600 border-orange-300 rounded focus:ring-orange-500 mr-3"
                                            />
                                            <div className="flex items-center">
                                                <Crown size={16} className="text-orange-500 mr-2" />
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
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="flex-1 flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium disabled:opacity-50"
                            >
                                <X size={20} />
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-sage-green-500 to-sage-green-600 text-white px-6 py-4 rounded-2xl hover:from-sage-green-600 hover:to-sage-green-700 transition-all duration-200 hover:scale-[1.02] shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <Plus size={20} />
                                        Add New Item
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddItemModal;