import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Components/Dashboard/DashboardLayout';
import {
  Users,
  Calendar,
  Briefcase,
  DollarSign,
  TrendingUp,
  MoreHorizontal,
  Star
} from 'lucide-react';
import {
  LineChart,
  Line,
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

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [platformStats, setPlatformStats] = useState({
    totalBookings: 0,
    activeUsers: 0,
    serviceProviders: 0,
    revenue: 0
  });
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [topProviders, setTopProviders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await APIAuthenticated.get('/booking/admin/stats');
      if (res.data.success) {
        setPlatformStats(res.data.stats);
        setChartData(res.data.chartData);
        setPieData(res.data.pieData);
        setRecentBookings(res.data.recentBookings);
        setTopProviders(res.data.topProviders);
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      setError("Failed to fetch dashboard data. Please try logging in again.");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { title: 'Total Bookings', value: platformStats.totalBookings.toLocaleString(), change: '+12%', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Active Users', value: platformStats.activeUsers.toLocaleString(), change: '+8%', icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Service Providers', value: platformStats.serviceProviders.toLocaleString(), change: '+15%', icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: 'Revenue', value: `Rs ${platformStats.revenue.toLocaleString()}`, change: '+22%', icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];


  return (
    <DashboardLayout role="admin" userName={user?.firstName || 'Admin'}>
      <div className="space-y-8">
        {/* Header Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500">Monitor and manage your platform</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center justify-between">
            <p className="font-medium">{error}</p>
            <button onClick={fetchAdminData} className="bg-white px-3 py-1 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50">Retry</button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.title} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bg} p-3 rounded-xl`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="flex items-center space-x-1 text-green-500 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
              <p className="text-xs text-gray-400 mt-2">from last month</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Trends */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800">Booking Trends</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <div className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#FFB800"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#FFB800', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Service Distribution */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800">Service Distribution</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <div className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
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
                  <Legend verticalAlign="bottom" height={36} />
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
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-sm font-medium border-b border-gray-50">
                    <th className="pb-4 font-medium">CUSTOMER</th>
                    <th className="pb-4 font-medium">SERVICE</th>
                    <th className="pb-4 font-medium">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 font-medium text-gray-700">{booking.customer}</td>
                      <td className="py-4 text-gray-500">{booking.service}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.statusColor}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Service Providers */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800">Top Service Providers</h3>
              <button className="text-[#FFB800] text-sm font-semibold hover:underline">View All</button>
            </div>
            <div className="space-y-6">
              {topProviders.map((provider) => (
                <div key={provider.id} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 font-bold overflow-hidden border border-gray-100">
                      {provider.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 group-hover:text-[#FFB800] transition-colors">{provider.name}</h4>
                      <p className="text-xs text-gray-400">{provider.service}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-sm font-bold text-gray-800">
                      <span>{provider.rating}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <p className="text-xs text-gray-400">{provider.jobs} jobs</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
