import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../Components/Dashboard/DashboardLayout';
import {
    Calendar,
    Clock,
    MapPin,
    User,
    CheckCircle2,
    XCircle,
    Loader2,
    Search,
    Filter,
    MessageSquare,
    Check,
    X,
    MoreHorizontal
} from 'lucide-react';
import { APIAuthenticated } from '../http';

const ProviderBookings = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusLoading, setStatusLoading] = useState(null);

    useEffect(() => {
        if (user?._id) {
            fetchBookings(user._id);
        }

        if (location.state?.filter) {
            setActiveTab(location.state.filter);
        }
    }, [location.state]);

    const fetchBookings = async (userId) => {
        try {
            setLoading(true);
            const res = await APIAuthenticated.get(`/booking/provider/${userId}`);
            if (res.data.success) {
                setBookings(res.data.bookings);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            setStatusLoading(bookingId);
            const res = await APIAuthenticated.put(`/booking/status/${bookingId}`, { status: newStatus });
            if (res.data.success) {
                setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));

                if (newStatus === 'Completed') {
                    const updatedBooking = bookings.find(b => b._id === bookingId);
                    navigate('/rating-feedback', {
                        state: {
                            booking: { ...updatedBooking, status: newStatus },
                            role: 'provider'
                        }
                    });
                }
            }
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setStatusLoading(null);
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

    const tabs = ['All', 'Pending', 'Confirmed', 'Completed', 'Rejected'];

    const filteredBookings = bookings.filter(booking => {
        const matchesTab = activeTab === 'All' || booking.status === activeTab;
        const searchStr = searchTerm.toLowerCase();
        const matchesSearch =
            booking.service.toLowerCase().includes(searchStr) ||
            `${booking.customer?.firstName} ${booking.customer?.lastName}`.toLowerCase().includes(searchStr);
        return matchesTab && matchesSearch;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <DashboardLayout role="provider" userName={user?.firstName || 'Provider'}>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Manage Bookings</h1>
                        <p className="text-gray-500 mt-1">Accept, manage, and complete your service requests.</p>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by service or customer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-gray-100 rounded-2xl pl-11 pr-4 py-3 min-w-[300px] focus:outline-none focus:border-yellow-200 shadow-sm transition-all text-sm font-medium"
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
                                ? 'bg-[#111827] text-white shadow-lg'
                                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Bookings List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="w-10 h-10 text-[#FFB800] animate-spin" />
                        <p className="text-gray-400 font-medium tracking-wide">Gathering your schedule...</p>
                    </div>
                ) : filteredBookings.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredBookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
                            >
                                <div className="p-8">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                        <div className="flex items-start space-x-6">
                                            <div className="w-16 h-16 rounded-2xl bg-yellow-50 flex items-center justify-center text-[#FFB800] group-hover:scale-105 transition-transform shrink-0">
                                                <Calendar className="w-8 h-8" />
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-3">
                                                    <h3 className="text-xl font-black text-gray-900">{booking.service}</h3>
                                                    <span className={`text-[10px] px-3 py-1 rounded-full border font-black uppercase tracking-wider ${getStatusStyles(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                                        {booking.customer?.firstName?.charAt(0)}
                                                    </div>
                                                    <p className="text-gray-700 font-bold">
                                                        Customer: {booking.customer?.firstName} {booking.customer?.lastName}
                                                    </p>
                                                </div>

                                                {booking.message && (
                                                    <div className="bg-gray-50 p-4 rounded-2xl border-l-4 border-yellow-400">
                                                        <p className="text-sm text-gray-600 italic font-medium">"{booking.message}"</p>
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap items-center gap-6 pt-2">
                                                    <div className="flex items-center text-sm font-bold text-gray-400">
                                                        <Calendar className="w-4 h-4 mr-2" />
                                                        {booking.date}
                                                    </div>
                                                    <div className="flex items-center text-sm font-bold text-gray-400">
                                                        <Clock className="w-4 h-4 mr-2" />
                                                        {booking.time}
                                                    </div>
                                                    <div className="flex items-center text-sm font-bold text-gray-400">
                                                        <MapPin className="w-4 h-4 mr-2" />
                                                        {booking.customer?.address || 'Near you'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-6 justify-between border-t lg:border-t-0 border-gray-50 pt-6 lg:pt-0">
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Proposed Rate</p>
                                                <div className="text-3xl font-black text-[#FFB800]">Rs {booking.amount}</div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={() => navigate(`/chat/${booking.customer?._id}`)}
                                                    className="p-4 rounded-2xl bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all shadow-sm"
                                                    title="Chat with Customer"
                                                >
                                                    <MessageSquare className="w-5 h-5" />
                                                </button>

                                                {booking.status === 'Pending' ? (
                                                    <>
                                                        <button
                                                            disabled={statusLoading === booking._id}
                                                            onClick={() => handleStatusUpdate(booking._id, 'Rejected')}
                                                            className="h-14 px-6 rounded-2xl border-2 border-red-50 text-red-500 font-black hover:bg-red-50 transition-all flex items-center justify-center"
                                                        >
                                                            {statusLoading === booking._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <X className="w-5 h-5" />}
                                                        </button>
                                                        <button
                                                            disabled={statusLoading === booking._id}
                                                            onClick={() => handleStatusUpdate(booking._id, 'Confirmed')}
                                                            className="h-14 px-8 rounded-2xl bg-gray-900 text-white font-black hover:bg-[#FFB800] transition-all shadow-lg shadow-gray-100 flex items-center justify-center space-x-2"
                                                        >
                                                            {statusLoading === booking._id ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                                                <>
                                                                    <span>Accept</span>
                                                                    <Check className="w-5 h-5" />
                                                                </>
                                                            )}
                                                        </button>
                                                    </>
                                                ) : booking.status === 'Confirmed' ? (
                                                    <button
                                                        disabled={statusLoading === booking._id}
                                                        onClick={() => handleStatusUpdate(booking._id, 'Completed')}
                                                        className="h-14 px-8 rounded-2xl bg-[#FFB800] text-white font-black hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-100 flex items-center justify-center space-x-2"
                                                    >
                                                        {statusLoading === booking._id ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                                            <>
                                                                <span>Mark Completed</span>
                                                                <CheckCircle2 className="w-5 h-5" />
                                                            </>
                                                        )}
                                                    </button>
                                                ) : (
                                                    <div className="text-xs font-bold text-gray-300 italic">No actions available</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center transition-transform hover:scale-110">
                            <Filter className="w-10 h-10 text-gray-200" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900">No Service Requests</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mt-2 font-medium">
                                You don't have any {activeTab !== 'All' ? activeTab.toLowerCase() : ''} bookings at the moment. Keep your profile updated to attract more customers!
                            </p>
                        </div>
                        {activeTab !== 'All' && (
                            <button
                                onClick={() => { setActiveTab('All'); setSearchTerm(''); }}
                                className="bg-[#111827] text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-gray-100 hover:bg-gray-800 transition-all"
                            >
                                Show All Bookings
                            </button>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ProviderBookings;
