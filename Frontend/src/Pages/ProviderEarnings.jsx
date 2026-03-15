import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Components/Dashboard/DashboardLayout';
import { BarChart3, TrendingUp, Calendar, CreditCard, Loader2 } from 'lucide-react';
import { APIAuthenticated } from '../http';

const ProviderEarnings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        if (userData?._id) {
            fetchBookings(userData._id);
        }
    }, []);

    const fetchBookings = async (userId) => {
        try {
            setLoading(true);
            const res = await APIAuthenticated.get(`/booking/provider/${userId}`);
            if (res.data.success) {
                // Keep only completed payments
                const completed = res.data.bookings.filter(b => b.paymentStatus === 'COMPLETED');
                setBookings(completed);
            }
        } catch (error) {
            console.error("Error fetching earnings:", error);
        } finally {
            setLoading(false);
        }
    };

    const totalEarnings = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);

    return (
        <DashboardLayout role="provider" userName={user?.firstName || 'Provider'}>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Earnings</h1>
                        <p className="text-gray-500 mt-1">Track your completed payments and revenue.</p>
                    </div>
                </div>

                {/* Earnings Summary */}
                <div className="bg-linear-to-r from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <TrendingUp className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-gray-400 font-bold uppercase tracking-wider mb-2">Total Earnings</p>
                        <h2 className="text-5xl font-black text-[#FFB800] tracking-tight">
                            Rs {totalEarnings.toLocaleString()}
                        </h2>
                        <p className="text-gray-300 mt-4 font-medium flex items-center">
                            <CreditCard className="w-5 h-5 mr-2" />
                            Based on {bookings.length} completed {bookings.length === 1 ? 'service' : 'services'}
                        </p>
                    </div>
                </div>

                {/* Payments List */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Payment History</h3>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
                        </div>
                    ) : bookings.length > 0 ? (
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <div key={booking._id} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-black text-lg shadow-sm">
                                            Rs
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">{booking.service}</h4>
                                            <p className="text-sm text-gray-500 font-medium flex items-center mt-1">
                                                <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                                                {booking.date} at {booking.time} • Customer: {booking.customer?.firstName} {booking.customer?.lastName}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 text-right">
                                        <div className="text-xl font-black text-gray-900">
                                            + Rs {booking.amount?.toLocaleString()}
                                        </div>
                                        <div className="text-xs font-bold text-green-600 uppercase tracking-widest mt-1">
                                            Completed
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h4 className="text-lg font-bold text-gray-900 mb-1">No Earnings Yet</h4>
                            <p className="text-gray-500">Completed payments will appear here automatically.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProviderEarnings;
