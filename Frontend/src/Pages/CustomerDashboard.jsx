import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../Components/Dashboard/DashboardLayout';
import {
  Calendar,
  Clock,
  CheckCircle,
  DollarSign,
  ArrowRight,
  History,
  Star,
  Headphones,
  Gift,
  Wrench,
  Zap,
  Leaf,
  ChevronRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { API, APIAuthenticated } from '../http';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalBookings: 0,
    pendingServices: 0,
    completed: 0,
    totalSpent: 0
  });
  const [spendingData, setSpendingData] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    if (userData && userData._id) {
      fetchDashboardData(userData._id);
    }
  }, []);

  const fetchDashboardData = async (userId) => {
    try {
      setLoading(true);
      const [statsRes, bookingsRes] = await Promise.all([
        APIAuthenticated.get(`/booking/stats/${userId}`),
        APIAuthenticated.get(`/booking/customer/${userId}`)
      ]);

      if (statsRes.data.success) {
        setDashboardStats(statsRes.data.stats);
        setSpendingData(statsRes.data.spendingData);
      }

      if (bookingsRes.data.success) {
        setUpcomingBookings(bookingsRes.data.bookings.filter(b => b.status !== 'Completed' && b.status !== 'Cancelled'));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { id: 'total', title: 'Total Bookings', value: dashboardStats.totalBookings.toString(), icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'pending', title: 'Pending Services', value: dashboardStats.pendingServices.toString(), icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'completed', title: 'Completed', value: dashboardStats.completed.toString(), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'spent', title: 'Total Spent', value: `Rs ${dashboardStats.totalSpent}`, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const favorites = [];

  return (
    <DashboardLayout role="customer" userName={user?.firstName || 'Customer'}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome back, {user?.firstName}!</h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your bookings today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.title}
              onClick={() => navigate('/customer/bookings', { state: { filter: stat.id === 'pending' ? 'Pending' : stat.id === 'completed' ? 'Completed' : 'All' } })}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bg} p-2.5 rounded-xl`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Dynamic Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Bookings */}
          {upcomingBookings.length > 0 ? (
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-bold text-slate-800 text-lg">Upcoming Bookings</h3>
                <button className="text-yellow-500 text-sm font-bold hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div key={booking._id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm group hover:border-yellow-200 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`bg-blue-100 p-3 rounded-xl transition-transform group-hover:scale-110`}>
                          <Zap className={`w-6 h-6 text-blue-600`} />
                        </div>
                        <div>
                          <div className="flex items-center space-x-3">
                            <h4 className="font-bold text-slate-800">{booking.service}</h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500">with {booking.provider?.firstName} {booking.provider?.lastName}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-slate-400">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{booking.date}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{booking.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-800">Rs {booking.amount}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 bg-white p-12 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-slate-300" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">No Upcoming Bookings</h4>
                <p className="text-sm text-slate-500 max-w-xs">You don't have any active bookings at the moment. Need help with something?</p>
              </div>
              <button onClick={() => navigate('/services')} className="text-yellow-600 font-bold hover:underline">Browse Services</button>
            </div>
          )}

          {/* Quick Actions */}
          <div className={`space-y-6 ${upcomingBookings.length === 0 ? 'lg:col-span-3' : ''}`}>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <button
                onClick={() => navigate('/services')}
                className="w-full bg-[#FFB800] text-white p-4 rounded-xl font-bold flex items-center justify-between group hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-100"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-1 rounded-lg">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span>Book Service</span>
                </div>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {[
                { title: 'View History', icon: History, path: '/customer/bookings' },
                { title: 'Rate Services', icon: Star, path: '/customer/reviews' },
                { title: 'Get Support', icon: Headphones, path: '/contact' }
              ].map((action) => (
                <button
                  key={action.title}
                  onClick={() => navigate(action.path)}
                  className="w-full bg-slate-50 text-slate-700 p-4 rounded-xl font-bold flex items-center justify-between group hover:bg-slate-100 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <action.icon className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                    <span>{action.title}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Charts section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
          {/* Monthly Spending */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 text-lg mb-6">Monthly Spending</h3>
            <div className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendingData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {spendingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === spendingData.length - 1 ? '#FFB800' : '#FFD97D'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Favorite Services */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 text-lg">Favorite Services</h3>
              <button className="text-yellow-500 text-xs font-bold hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {favorites.length > 0 ? (
                favorites.map((fav) => (
                  <div key={fav.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-yellow-100 transition-all cursor-pointer group">
                    <div className={`${fav.iconBg} w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <fav.icon className={`w-5 h-5 ${fav.iconColor}`} />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">{fav.name}</h4>
                    <p className="text-[10px] text-slate-400 mb-2">{fav.bookings} bookings</p>
                    <div className="flex items-center space-x-1 text-xs font-bold text-slate-700">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{fav.rating}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-10 flex flex-col items-center justify-center text-center bg-slate-50 rounded-2xl border border-transparent">
                  <p className="text-xs text-slate-400 font-medium">No favorites yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
