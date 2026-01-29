import React, { useState } from 'react';
import { API } from '../http';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            const response = await API.post('/contact', formData);
            if (response.status === 200) {
                setStatus({ type: 'success', msg: 'Message sent successfully! We will get back to you soon.' });
                setFormData({ name: '', phone: '', email: '', message: '' });
            }
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to send message. Please try again later.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
                {/* Info Column */}
                <div className="flex-1 space-y-12">
                    <div className="space-y-6">
                        <h1 className="text-6xl font-black text-[#1e293b] leading-tight">
                            Get in <br />
                            <span className="text-[#FFB800]">Touch</span>
                        </h1>
                        <p className="text-gray-500 text-xl max-w-md">
                            Have questions about our services or want to join as a provider? Fill out the form and our team will respond within 24 hours.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl">📍</div>
                            <div>
                                <h4 className="font-bold text-gray-900">Office</h4>
                                <p className="text-sm text-gray-500">Kathmandu, Nepal</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl">📧</div>
                            <div>
                                <h4 className="font-bold text-gray-900">Email</h4>
                                <p className="text-sm text-gray-500">info@bookybee.com</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl">📞</div>
                            <div>
                                <h4 className="font-bold text-gray-900">Phone</h4>
                                <p className="text-sm text-gray-500">+977 9800000000</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl">🕒</div>
                            <div>
                                <h4 className="font-bold text-gray-900">Support</h4>
                                <p className="text-sm text-gray-500">24/7 Assistance</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Column */}
                <div className="flex-1">
                    <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200 p-10 border border-gray-50 relative overflow-hidden">
                        {/* Decorative blob */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full -mr-16 -mt-16 -z-10"></div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Send us a message</h2>

                        {status.msg && (
                            <div className={`mb-8 p-4 rounded-2xl text-center font-semibold text-sm ${status.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                {status.msg}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:bg-white outline-none transition-all"
                                        placeholder="Ram Bahadur"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:bg-white outline-none transition-all"
                                        placeholder="9800000000"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:bg-white outline-none transition-all"
                                    placeholder="ram@gmail.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                                <textarea
                                    name="message"
                                    required
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:bg-white outline-none transition-all resize-none"
                                    placeholder="Tell us what you need help with..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#FFB800] text-white font-black py-4 rounded-2xl hover:bg-yellow-500 transition-all shadow-xl shadow-yellow-200 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
