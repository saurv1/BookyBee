import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../Components/Dashboard/DashboardLayout';
import { Calendar, Clock, MapPin, User, CheckCircle2, XCircle, Loader2, Search, Filter, MessageSquare } from 'lucide-react';
import { APIAuthenticated } from '../http';

const BookingHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    if (userData?._id) {
      fetchBookings(userData._id);
    }

    // Set active tab if passed from dashboard
    if (location.state?.filter) {
      setActiveTab(location.state.filter);
    }
  }, [location.state]);

  const fetchBookings = async (userId) => {
    try {
      setLoading(true);
      const res = await APIAuthenticated.get(`/booking/customer/${userId}`);
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
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
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const tabs = ['All', 'Pending', 'Confirmed', 'Completed', 'Rejected'];

  const filteredBookings = bookings.filter(booking => {
    const matchesTab = activeTab === 'All' || booking.status === activeTab;
    const searchStr = searchTerm.toLowerCase();
    const matchesSearch =
      booking.service.toLowerCase().includes(searchStr) ||
      `${booking.provider?.firstName} ${booking.provider?.lastName}`.toLowerCase().includes(searchStr);
    return matchesTab && matchesSearch;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <DashboardLayout role="customer" userName={user?.firstName || 'Customer'}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Booking History</h1>
            <p className="text-gray-500 mt-1">Manage and track all your service requests.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by service or provider..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-gray-100 rounded-2xl pl-11 pr-4 py-3 min-w-[300px] focus:outline-none focus:border-yellow-200 shadow-sm transition-all"
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
            <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
            <p className="text-gray-400 font-medium">Fetching your records...</p>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm hover:border-yellow-100 transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-start space-x-6">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-colors">
                      <Calendar className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-xl font-black text-gray-900">{booking.service}</h3>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full border font-black uppercase tracking-wider ${getStatusStyles(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-gray-500 font-medium flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Provider: {booking.provider?.firstName} {booking.provider?.lastName}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mt-4 text-sm font-bold text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {booking.date}
                        </div>
                        <div className="flex items-center text-gray-200">•</div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {booking.time}
                        </div>
                        <div className="flex items-center text-gray-200">•</div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {booking.provider?.phone || 'Contact via message'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end lg:space-x-8 pt-6 lg:pt-0 border-t lg:border-t-0 border-gray-50">
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-bold uppercase mb-1">Total Amount</p>
                      <div className="text-2xl font-black text-[#FFB800]">Rs {booking.amount}</div>
                    </div>
                    <button
                      onClick={() => navigate(`/chat/${booking.provider?._id}`)}
                      className="px-6 py-3 rounded-2xl bg-[#111827] text-white font-bold hover:bg-[#FFB800] transition-all shadow-lg flex items-center space-x-2"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-20 rounded-[2.5rem] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
              <Filter className="w-10 h-10 text-gray-200" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900">No Bookings Found</h3>
              <p className="text-gray-500 max-w-sm mt-2">
                We couldn't find any {activeTab !== 'All' ? activeTab.toLowerCase() : ''} bookings matching your criteria.
              </p>
            </div>
            <button
              onClick={() => { setActiveTab('All'); setSearchTerm(''); }}
              className="bg-[#FFB800] text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-yellow-100 hover:bg-yellow-500 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BookingHistory;
