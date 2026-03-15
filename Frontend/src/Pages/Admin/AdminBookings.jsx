import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../Components/Dashboard/DashboardLayout';
import { Calendar, CheckCircle2, XCircle, Search, Loader2 } from 'lucide-react';
import { APIAuthenticated } from '../../http';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('All');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await APIAuthenticated.get('/booking/admin/all');
            if (res.data.success) {
                setBookings(res.data.bookings);
            }
        } catch (error) {
            console.error("Error fetching admin bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-orange-100 text-orange-700';
            case 'Confirmed': return 'bg-blue-100 text-blue-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const tabs = ['All', 'Completed', 'Pending', 'Confirmed', 'Rejected'];

    const filteredBookings = bookings.filter(b => {
        const matchesTab = activeTab === 'All' || b.status === activeTab;
        const searchStr = searchTerm.toLowerCase();
        const matchesSearch =
            b.service.toLowerCase().includes(searchStr) ||
            (b.customer?.firstName + ' ' + b.customer?.lastName).toLowerCase().includes(searchStr) ||
            (b.provider?.firstName + ' ' + b.provider?.lastName).toLowerCase().includes(searchStr);
        return matchesTab && matchesSearch;
    });

    return (
        <DashboardLayout role="admin" userName="Admin">
            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">All Bookings</h1>
                        <p className="text-gray-500 mt-1">Manage and track all service appointments on the platform.</p>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search service, customer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-gray-100 rounded-2xl pl-11 pr-4 py-3 min-w-75 focus:outline-none focus:border-blue-200 outline-hidden shadow-sm transition-all text-sm w-full md:w-auto"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                    : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100 shadow-xs'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Bookings List */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[11px] font-black uppercase tracking-wider">
                                    <th className="p-5">Service</th>
                                    <th className="p-5">Customer</th>
                                    <th className="p-5">Provider</th>
                                    <th className="p-5">Schedule</th>
                                    <th className="p-5">Amount</th>
                                    <th className="p-5">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="py-20 text-center">
                                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                                            <p className="text-gray-400 font-medium mt-4">Loading bookings...</p>
                                        </td>
                                    </tr>
                                ) : filteredBookings.length > 0 ? (
                                    filteredBookings.map((booking) => (
                                        <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="p-5">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                                        <Calendar className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-bold text-gray-900">{booking.service}</span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <p className="font-semibold text-gray-800">{booking.customer?.firstName} {booking.customer?.lastName}</p>
                                                <p className="text-xs text-gray-500 font-medium">{booking.customer?.email}</p>
                                            </td>
                                            <td className="p-5">
                                                <p className="font-semibold text-gray-800">{booking.provider?.firstName} {booking.provider?.lastName}</p>
                                                <p className="text-xs text-gray-500 font-medium">{booking.provider?.email}</p>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center space-x-2 text-sm text-gray-600 font-medium">
                                                    <span>{booking.date}</span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                    <span>{booking.time}</span>
                                                </div>
                                            </td>
                                            <td className="p-5 font-black text-gray-900">
                                                Rs {booking.amount}
                                            </td>
                                            <td className="p-5">
                                                <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full ${getStatusStyles(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-20 text-center">
                                            <div className="flex flex-col items-center">
                                                <Calendar className="w-12 h-12 text-gray-200 mb-4" />
                                                <p className="text-gray-500 font-medium text-lg">No bookings found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminBookings;
