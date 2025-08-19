import React, { useState } from 'react';
import { Clock, Send, CheckCircle, X } from 'lucide-react';

const Reservation: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '2',
        message: ''
    });

    const hoursData = [
        { day: "Monday - Thursday", hours: "11:00 AM - 11:00 PM", start: "11:00", end: "23:00" },
        { day: "Friday", hours: "1:30 PM - 11:00 PM", start: "13:30", end: "23:00" },
        { day: "Saturday - Sunday", hours: "12:00 PM - 12:00 AM", start: "12:00", end: "24:00" }
    ];

    // Function to get day of week from date
    const getDayOfWeek = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        if (day >= 1 && day <= 4) return "Monday - Thursday";
        if (day === 5) return "Friday";
        if (day === 0 || day === 6) return "Saturday - Sunday";
        return "Monday - Thursday"; // fallback
    };

    // Function to generate time slots based on selected date
    const generateTimeSlots = (dateString: string) => {
        if (!dateString) return [];
        
        const dayType = getDayOfWeek(dateString);
        const dayData = hoursData.find(data => data.day === dayType);
        
        if (!dayData) return [];
        
        const slots = [];
        const startTime = new Date(`2000-01-01T${dayData.start}:00`);
        const endTime = new Date(`2000-01-01T${dayData.end}:00`);
        
        // Generate 30-minute intervals
        const currentTime = new Date(startTime);
        while (currentTime < endTime) {
            const timeString = currentTime.toTimeString().slice(0, 5);
            const displayTime = currentTime.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
            
            slots.push({
                value: timeString,
                label: displayTime
            });
            
            currentTime.setMinutes(currentTime.getMinutes() + 30);
        }
        
        return slots;
    };

    const availableTimeSlots = generateTimeSlots(formData.date);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitStatus('success');
            setFormData({
                name: '',
                email: '',
                phone: '',
                date: '',
                time: '',
                guests: '2',
                message: ''
            });

            // Auto-close popup after 5 seconds
            setTimeout(() => setSubmitStatus('idle'), 5000);
        }, 1000);
    };

    // Reset time when date changes
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            time: '' // Reset time when date changes
        }));
    };

    return (
        <div>
            {/* Hero Section */}
            <section className="max-w-7xl mt-20 m-auto bg-cream-50">
                <div className="max-w-7xl mx-auto  text-left">
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-brown-700 mb-4">
                        Make a Reservation
                    </h2>
                    <p className="font-body text-lg text-warm-brown-600 max-w-7xl mb-8">
                        Reserve your table at Cinnamon Leaf and experience our exceptional fusion cuisine in a warm, inviting atmosphere.
                    </p>
                </div>

                <div className="max-w-7xl m-auto bg-cream-50 p-8 rounded-2xl border border-sage-green-200">
                    <div className="flex justify-center mb-6">
                        <Clock className="w-6 h-6 text-sage-green-600" />
                    </div>
                    <h3 className="font-body text-xl font-semibold text-warm-brown-700 mb-6 text-center">
                        Opening Hours
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {hoursData.map((item, index) => (
                            <div key={index} className="text-center p-4 bg-cream-50 rounded-xl">
                                <h4 className="font-body font-semibold text-warm-brown-700 mb-2">
                                    {item.day}
                                </h4>
                                <p className="font-body text-sage-green-600 font-medium">
                                    {item.hours}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reservation Form */}
            <section className="py-16 bg-cream-50 ">
                <div className="box-border max-w-7xl mx-auto py-10 px-10 border border-sage-green-200 rounded-2xl">
                    <div>
                        <h2 className="font-display text-3xl font-bold text-warm-brown-700 mb-8">
                            Book Your Table
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-warm-brown-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-green-500 focus:border-sage-green-500 transition-colors"
                                        placeholder="Your full name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-warm-brown-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-green-500 focus:border-sage-green-500 transition-colors"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-warm-brown-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-green-500 focus:border-sage-green-500 transition-colors"
                                        placeholder="(123) 456-7890"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="date" className="block text-sm font-medium text-warm-brown-700 mb-2">
                                        Preferred Date *
                                    </label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleDateChange}
                                        required
                                        className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-green-500 focus:border-sage-green-500 transition-colors"
                                    />
                                </div>

                                                                    <div>
                                        <label htmlFor="time" className="block text-sm font-medium text-warm-brown-700 mb-2">
                                            Preferred Time *
                                        </label>
                                        <select
                                            id="time"
                                            name="time"
                                            value={formData.time}
                                            onChange={handleInputChange}
                                            required
                                            disabled={!formData.date}
                                            className={`w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-green-500 focus:border-sage-green-500 transition-colors ${
                                                !formData.date ? 'bg-gray-100 cursor-not-allowed' : ''
                                            }`}
                                        >
                                            <option value="">
                                                {!formData.date ? 'Please select a date first' : 'Select time'}
                                            </option>
                                            {availableTimeSlots.map((slot) => (
                                                <option key={slot.value} value={slot.value}>
                                                    {slot.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                <div>
                                    <label htmlFor="guests" className="block text-sm font-medium text-warm-brown-700 mb-2">
                                        Number of Guests *
                                    </label>
                                    <select
                                        id="guests"
                                        name="guests"
                                        value={formData.guests}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-green-500 focus:border-sage-green-500 transition-colors"
                                    >
                                        {[...Array(12)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-warm-brown-700 mb-2">
                                    Special Requests or Dietary Requirements
                                </label>
                                                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:border-sage-green-500 focus:outline-none focus:ring-2 focus:ring-sage-green-200 transition-colors"
                                        placeholder="Let us know about any allergies, dietary preferences, or special occasions..."
                                        style={{resize: 'none'}}
                                    />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-sage-green-600 text-white px-8 py-4 rounded-lg font-body font-semibold text-lg hover:bg-sage-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Submitting...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <Send className="w-5 h-5 mr-2" />
                                        Send Reservation Request
                                    </div>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Success Popup Modal */}
            {submitStatus === 'success' && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl">
                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <CheckCircle className="w-16 h-16 text-sage-green-600" />
                            </div>
                            <h3 className="font-display text-2xl font-bold text-warm-brown-700 mb-4">
                                Reservation Sent!
                            </h3>
                            <p className="font-body text-warm-brown-600 mb-6">
                                Your reservation request has been submitted successfully! We'll contact you soon to confirm your booking.
                            </p>
                            <button
                                onClick={() => setSubmitStatus('idle')}
                                className="bg-sage-green-600 text-white px-6 py-3 rounded-lg font-body font-semibold hover:bg-sage-green-700 transition-colors duration-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reservation;
