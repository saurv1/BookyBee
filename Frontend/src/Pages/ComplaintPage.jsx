import React, { useState } from 'react';
import DashboardLayout from '../Components/Dashboard/DashboardLayout';
import { AlertCircle, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { APIAuthenticated } from '../http';

const ComplaintPage = () => {
    const [formData, setFormData] = useState({
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await APIAuthenticated.post('/complaint', formData);
            if (res.data.success) {
                setSuccess(true);
                setFormData({ subject: '', message: '' });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto py-8">
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                    <div className="bg-yellow-500 p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h1 className="text-3xl font-black mb-2">Submit a Complaint</h1>
                            <p className="text-yellow-50 font-medium opacity-90">We're here to help. Tell us what went wrong and we'll fix it.</p>
                        </div>
                        <AlertCircle className="absolute -right-8 -bottom-8 w-48 h-48 text-white/10 rotate-12" />
                    </div>

                    <div className="p-8 md:p-12">
                        {success ? (
                            <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 mb-4">Complaint Received!</h2>
                                <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto font-medium">
                                    We've received your complaint and sent an email notification to our team. We'll get back to you as soon as possible.
                                </p>
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="px-8 py-3.5 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
                                >
                                    Submit Another Complaint
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-600 animate-shake">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <p className="font-bold text-sm">{error}</p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 uppercase tracking-wider ml-1">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Briefly describe the issue"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-yellow-200 focus:outline-none transition-all text-gray-700 shadow-sm font-medium"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 uppercase tracking-wider ml-1">Message</label>
                                    <textarea
                                        required
                                        rows="6"
                                        placeholder="Please provide all relevant details..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-yellow-200 focus:outline-none transition-all text-gray-700 shadow-sm font-medium resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            <span>Submitting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            <span>Send Complaint</span>
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-widest pt-4">
                                    Secure & confidential support feedback
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ComplaintPage;
