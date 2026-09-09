import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Save, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { Category } from '../../../types/menu';
import { createCategory, updateCategory } from '../../../services/categories';
import { getImageUrl } from '../../../utils/imageUrl';

interface CategoryFormModalProps {
    isOpen: boolean;
    category: Category | null; // null = add mode, otherwise edit mode
    onClose: () => void;
    onSaved: () => void;
}

interface FormDataState {
    name: string;
    description: string;
    image: File | string;
}

const emptyForm: FormDataState = {
    name: '',
    description: '',
    image: ''
};

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
    isOpen,
    category,
    onClose,
    onSaved
}) => {
    const [formData, setFormData] = useState<FormDataState>(emptyForm);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [dragActive, setDragActive] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isEditMode = !!category;

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                description: category.description || '',
                image: category.image || ''
            });
            setPreviewImage(getImageUrl(category.image) || '');
        } else {
            setFormData(emptyForm);
            setPreviewImage('');
        }
    }, [category, isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            setFormData(prev => ({ ...prev, image: file }));

            const reader = new FileReader();
            reader.onload = (e) => setPreviewImage(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('description', formData.description);

            if (formData.image instanceof File) {
                submitData.append('image', formData.image);
            }

            const response = isEditMode
                ? await updateCategory(category!._id, submitData)
                : await createCategory(submitData);

            if (response.success) {
                toast.success(`Category ${isEditMode ? 'updated' : 'created'} successfully!`);
                onSaved();
                onClose();
            } else {
                toast.error(response.message || 'Failed to save category');
            }
        } catch (error: any) {
            console.error('Error saving category:', error);
            toast.error(error.response?.data?.message || 'Failed to save category');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-5 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[95vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                <form onSubmit={handleSubmit}>
                    <div className="relative bg-gradient-to-r from-warm-brown-50 via-cream-50 to-sage-green-50 px-8 py-6 border-b border-warm-brown-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-3xl font-display font-bold text-warm-brown-800 mb-1">
                                    {isEditMode ? 'Edit Category' : 'Add New Category'}
                                </h3>
                                <p className="text-sage-green-600 font-body">
                                    {isEditMode ? 'Update this category\'s details' : 'Create a new menu category'}
                                </p>
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

                    <div className="p-8 overflow-y-auto max-h-[calc(95vh-180px)]">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-2 font-body">Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-warm-brown-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green-500 focus:border-transparent transition-all font-body"
                                    placeholder="e.g. Starters"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-2 font-body">Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-warm-brown-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green-500 focus:border-transparent transition-all font-body resize-none"
                                    placeholder="Short description shown on the homepage..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-3 font-body">Category Image</label>
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
                                            <div className="relative mx-auto w-48 h-32 rounded-xl overflow-hidden shadow-lg">
                                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
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
                                            <p className="text-sm text-gray-500">
                                                Drop an image here, or{' '}
                                                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sage-green-600 hover:text-sage-green-700">
                                                    browse
                                                </button>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

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
                                ) : isEditMode ? (
                                    <>
                                        <Save size={20} />
                                        Save Changes
                                    </>
                                ) : (
                                    <>
                                        <Plus size={20} />
                                        Add Category
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

export default CategoryFormModal;
