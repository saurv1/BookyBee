import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../Components/Dashboard/DashboardLayout';
import { 
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { TrendingUp, Users, Calendar, DollarSign, Star, ShieldCheck, Loader2, Download } from 'lucide-react';
import { APIAuthenticated } from '../../http';

const AdminAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const res = await APIAuthenticated.get('/booking/admin/analytics');
            if (res.data.success) {
                setData(res.data);
            }
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#FFB800', '#6366F1', '#10B981', '#F43F5E', '#8B5CF6'];

    if (loading) {
        return (
            <DashboardLayout role="admin" userName="Admin">
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                    <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Crushing the data...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="admin" userName="Admin">
            <div className="space-y-8 max-w-7xl mx-auto pb-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Platform Analytics</h1>
                        <p className="text-gray-500 mt-1 font-medium italic">Deep insights into BookyBee ecosystem behavior.</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Users</p>
                            <p className="text-2xl font-black text-gray-900">{data?.summary.totalUsers}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
                        <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-500">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Bookings</p>
                            <p className="text-2xl font-black text-gray-900">{data?.summary.totalBookings}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
                            <Star className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Avg Rating</p>
                            <p className="text-2xl font-black text-gray-900">{data?.summary.avgRating}/5</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Complaints Resolved</p>
                            <p className="text-2xl font-black text-gray-900">{data?.summary.complaintResolutionRate}%</p>
                        </div>
                    </div>
                </div>

                {/* Main Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Revenue Trends */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center space-x-2">
                            <DollarSign className="w-5 h-5 text-yellow-500" />
                            <span>Revenue Trends (Rs)</span>
                        </h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.timeSeriesData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FFB800" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#FFB800" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                                    <Area type="monotone" dataKey="revenue" stroke="#FFB800" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Booking Volume */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                            <span>Booking Volume</span>
                        </h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data?.timeSeriesData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                                    <Bar dataKey="bookings" fill="#6366F1" radius={[8, 8, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Booking Status Distribution */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-black text-gray-900 mb-8">Booking Status Distribution</h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data?.statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data?.statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* User Growth */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center space-x-2">
                            <Users className="w-5 h-5 text-green-500" />
                            <span>Cumulative User Growth</span>
                        </h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data?.userGrowthData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                                    <Line type="stepAfter" dataKey="users" stroke="#10B981" strokeWidth={4} dot={{r: 6, fill: '#10B981', strokeWidth: 3, stroke: '#fff'}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Category performance */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-black text-gray-900 mb-8">Top 5 Performing Categories (by Revenue)</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.categoryData} layout="vertical" margin={{ left: 40, right: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#1e293b', fontWeight: 'bold', fontSize: 13}} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '16px', border: 'none'}} />
                                <Bar dataKey="revenue" fill="#FFB800" radius={[0, 10, 10, 0]} barSize={25} label={{ position: 'right', fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminAnalytics;
