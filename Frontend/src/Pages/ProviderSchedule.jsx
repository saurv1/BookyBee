import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Components/Dashboard/DashboardLayout';
import { Clock, Calendar, MapPin, Loader2, CalendarDays } from 'lucide-react';
import { APIAuthenticated } from '../http';

const ProviderSchedule = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        const providerId = userData?._id || userData?.id;
        if (providerId) {
            fetchBookings(providerId);
        }
    }, []);

    const fetchBookings = async (providerId) => {
        try {
            setLoading(true);
            const res = await APIAuthenticated.get(`/booking/provider/${providerId}`);
            if (res.data.success) {
                // Keep only Confirmed and Pending, and sort by date
                const upcoming = res.data.bookings
                    .filter(b => b.status === 'Confirmed' || b.status === 'Pending')
                    .sort((a, b) => {
                        const dateA = new Date(`${a.date} ${a.time}`);
                        const dateB = new Date(`${b.date} ${b.time}`);
                        return dateA - dateB;
                    });
                setBookings(upcoming);
            }
        } catch (error) {
            console.error("Error fetching schedule:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-700 border-green-200';
            case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'Completed': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'Cancelled': return 'bg-red-50 text-red-400 border-red-100';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    return (
        <DashboardLayout role="provider" userName={user?.firstName || 'Provider'}>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Schedule</h1>
                        <p className="text-gray-500 mt-1">Review your upcoming services and appointments.</p>
                    </div>
                </div>

                {/* Schedule List */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
                        </div>
                    ) : bookings.length > 0 ? (
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <div key={booking._id} className="p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:border-yellow-200 transition-all">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-14 h-14 rounded-2xl bg-yellow-50 text-yellow-600 flex items-center justify-center font-black">
                                                <CalendarDays className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-xl">{booking.service}</h4>
                                                <p className="text-gray-600 font-medium">
                                                    Customer: {booking.customer?.firstName} {booking.customer?.lastName}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-1 text-gray-500 font-medium text-sm">
                                                <Calendar className="w-4 h-4" />
                                                {booking.date}
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-500 font-medium text-sm">
                                                <Clock className="w-4 h-4" />
                                                {booking.time}
                                            </div>
                                            {booking.customer?.address && (
                                                <div className="flex items-center gap-1 text-gray-500 font-medium text-sm">
                                                    <MapPin className="w-4 h-4" />
                                                    {booking.customer?.address}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <div className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border ${getStatusStyles(booking.status)}`}>
                                            {booking.status}
                                        </div>
                                        <div className="font-black text-[#FFB800] text-lg">
                                            Rs {booking.amount}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 p-20 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                            <CalendarDays className="w-16 h-16 text-gray-300 mb-6" />
                            <h3 className="text-2xl font-black text-gray-900">You don't have any upcoming services</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mt-2 font-medium">
                                Your schedule is clear. Make sure your provider profile is fully complete to attract customers!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProviderSchedule;
