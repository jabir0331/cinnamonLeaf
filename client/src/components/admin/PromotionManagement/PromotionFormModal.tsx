import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Save, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { Promotion } from '../../../types/menu';
import { createPromotion, updatePromotion } from '../../../services/promotions';
import { getImageUrl } from '../../../utils/imageUrl';

interface PromotionFormModalProps {
    isOpen: boolean;
    promotion: Promotion | null; // null = add mode, otherwise edit mode
    onClose: () => void;
    onSaved: () => void;
}

interface FormDataState {
    title: string;
    description: string;
    badgeText: string;
    validUntil: string;
    image: File | string;
}

const emptyForm: FormDataState = {
    title: '',
    description: '',
    badgeText: '',
    validUntil: '',
    image: ''
};

const toDateInputValue = (validUntil?: string) => {
    if (!validUntil) return '';
    return new Date(validUntil).toISOString().slice(0, 10);
};

const PromotionFormModal: React.FC<PromotionFormModalProps> = ({
    isOpen,
    promotion,
    onClose,
    onSaved
}) => {
    const [formData, setFormData] = useState<FormDataState>(emptyForm);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [dragActive, setDragActive] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isEditMode = !!promotion;

    useEffect(() => {
        if (promotion) {
            setFormData({
                title: promotion.title,
                description: promotion.description || '',
                badgeText: promotion.badgeText || '',
                validUntil: toDateInputValue(promotion.validUntil),
                image: promotion.image || ''
            });
            setPreviewImage(getImageUrl(promotion.image) || '');
        } else {
            setFormData(emptyForm);
            setPreviewImage('');
        }
    }, [promotion, isOpen]);

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

        if (!formData.title || !formData.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            submitData.append('badgeText', formData.badgeText);
            submitData.append('validUntil', formData.validUntil);

            if (formData.image instanceof File) {
                submitData.append('image', formData.image);
            }

            const response = isEditMode
                ? await updatePromotion(promotion!._id, submitData)
                : await createPromotion(submitData);

            if (response.success) {
                toast.success(`Promotion ${isEditMode ? 'updated' : 'created'} successfully!`);
                onSaved();
                onClose();
            } else {
                toast.error(response.message || 'Failed to save promotion');
            }
        } catch (error: any) {
            console.error('Error saving promotion:', error);
            toast.error(error.response?.data?.message || 'Failed to save promotion');
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
                                    {isEditMode ? 'Edit Promotion' : 'Add New Promotion'}
                                </h3>
                                <p className="text-sage-green-600 font-body">
                                    {isEditMode ? 'Update this promotion\'s details' : 'Create a new offer for customers'}
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
                                <label className="block text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-2 font-body">Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-warm-brown-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green-500 focus:border-transparent transition-all font-body"
                                    placeholder="e.g. Weekday Lunch Special"
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
                                    placeholder="20% off every main course, Monday to Friday, 12-3pm."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-2 font-body">Badge Text</label>
                                    <input
                                        type="text"
                                        name="badgeText"
                                        value={formData.badgeText}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-warm-brown-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green-500 focus:border-transparent transition-all font-body"
                                        placeholder="e.g. 20% OFF"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-2 font-body">Valid Until</label>
                                    <input
                                        type="date"
                                        name="validUntil"
                                        value={formData.validUntil}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-warm-brown-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green-500 focus:border-transparent transition-all font-body"
                                    />
                                    <p className="text-xs text-gray-400 mt-1 font-body">Leave blank for an ongoing offer</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-3 font-body">Promotion Image</label>
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
                                        Add Promotion
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

export default PromotionFormModal;
