import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Components/Dashboard/DashboardLayout';
import {
  Calendar,
  Clock,
  DollarSign,
  Star,
  TrendingUp,
  MoreHorizontal,
  ChevronRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { APIAuthenticated } from '../http';

const ProviderDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [providerStats, setProviderStats] = useState({
    totalBookings: 0,
    pendingRequests: 0,
    totalEarnings: 0,
    averageRating: 0
  });
  const [earningsData, setEarningsData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    if (userData && userData._id) {
      fetchProviderData(userData._id);
    }
  }, []);

  const fetchProviderData = async (providerId) => {
    try {
      setLoading(true);
      const res = await APIAuthenticated.get(`/booking/provider/stats/${providerId}`);
      if (res.data.success) {
        setProviderStats(res.data.stats);
        setEarningsData(res.data.earningsData);
        setPieData(res.data.pieData);
        setRecentBookings(res.data.recentBookings);
      }
    } catch (error) {
      console.error("Error fetching provider statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { title: 'Total Bookings', value: providerStats.totalBookings.toString(), change: '+12%', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Pending Requests', value: providerStats.pendingRequests.toString(), change: `${providerStats.pendingRequests} pending`, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Total Earnings', value: `Rs ${providerStats.totalEarnings.toLocaleString()}`, change: '+18%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Average Rating', value: providerStats.averageRating.toFixed(1), change: `${providerStats.averageRating}/5`, icon: Star, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const recentReviews = [
    { id: 1, name: 'Lisa Anderson', rating: 5, comment: 'Excellent service! Very professional and thorough.', date: '2 days ago' },
    { id: 2, name: 'Robert Taylor', rating: 4, comment: 'Great work! Arrived on time and finished quickly.', date: '1 week ago' },
  ];

  return (
    <DashboardLayout role="provider" userName={user?.firstName || 'Provider'}>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hello, {user?.firstName || 'Provider'}!</h1>
            <p className="text-gray-500">Here's what's happening with your services today.</p>
          </div>
          <button className="bg-[#FFB800] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-100">
            Go Online
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.title} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bg} p-2.5 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-xs font-semibold px-2 py-1 rounded-full bg-green-50 text-green-600">
                  {stat.change}
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Earnings Overview */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-gray-800">Earnings Overview</h3>
                <p className="text-xs text-gray-400">Monthly earnings for the last 6 months</p>
              </div>
              <select className="text-sm bg-gray-50 border-none rounded-lg focus:ring-0 cursor-pointer">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningsData}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFB800" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#FFB800" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="#FFB800"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorEarnings)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Service Distribution */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
            <h3 className="font-bold text-gray-800 mb-2">Service Distribution</h3>
            <p className="text-xs text-gray-400 mb-6">Breakdown by service type</p>
            <div className="flex-1 h-62.5 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Lists Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800">Recent Bookings</h3>
              <button className="text-[#FFB800] text-sm font-semibold hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-yellow-100 transition-all group">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-gray-700 shadow-sm">
                      {booking.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">{booking.name}</h4>
                      <p className="text-xs text-gray-500">{booking.service}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-800">{booking.amount}</div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${booking.statusColor}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800">Recent Reviews</h3>
              <button className="text-[#FFB800] text-sm font-semibold hover:underline">View All</button>
            </div>
            <div className="space-y-6">
              {recentReviews.map((review) => (
                <div key={review.id} className="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 text-xs font-bold">
                        {review.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-gray-800">{review.name}</span>
                    </div>
                    <div className="flex items-center space-x-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-1">{review.comment}</p>
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProviderDashboard;
