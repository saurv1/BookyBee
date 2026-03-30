import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../Components/Dashboard/DashboardLayout';
import { Trash2, Briefcase, Search, Star, MapPin } from 'lucide-react';
import { APIAuthenticated } from '../../http';

const AdminProviders = () => {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        fetchProviders();
    }, []);

    const fetchProviders = async () => {
        try {
            setLoading(true);
            const res = await APIAuthenticated.get('/auth/users');
            if (res.data.success) {
                // Filter only providers
                const pro = res.data.data.filter(u => u.role === 'provider' || u.role === 'serviceprovider');
                setProviders(pro);
            }
        } catch (error) {
            console.error("Error fetching providers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this provider?")) {
            try {
                const res = await APIAuthenticated.delete(`/auth/delete/${id}`);
                if (res.data.success) {
                    setProviders(providers.filter(u => u._id !== id));
                    alert("Provider deleted successfully");
                }
            } catch (error) {
                alert(error.response?.data?.message || "Failed to delete provider");
            }
        }
    };

    const filteredProviders = providers.filter(u =>
        (u.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.serviceCategory && u.serviceCategory.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (u.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="admin" userName={user?.firstName || 'Admin'}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Service Provider Management</h1>
                        <p className="text-gray-500 text-sm">View and manage all registered service professionals</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all text-sm w-full md:w-64 shadow-sm"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-50">
                                    <th className="px-6 py-4">Provider</th>
                                    <th className="px-6 py-4">Category & Location</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-10 h-10 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
                                                <p className="mt-4 text-gray-500 font-medium">Loading providers...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredProviders.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center">
                                            <div className="max-w-xs mx-auto">
                                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                                    <Briefcase className="w-8 h-8" />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-800">No providers found</h3>
                                                <p className="text-gray-500 text-sm mt-1">We couldn't find any professionals matching your search.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProviders.map((p) => (
                                        <tr key={p._id} className="hover:bg-gray-50/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 font-bold border-2 border-white shadow-sm">
                                                        {p.firstName?.charAt(0) || 'P'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800">{p.firstName} {p.lastName}</p>
                                                        <p className="text-xs text-gray-400">{p.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <span className="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                                        {p.serviceCategory || 'General'}
                                                    </span>
                                                    <div className="flex items-center text-xs text-gray-400 mt-1">
                                                        <MapPin className="w-3 h-3 mr-1" />
                                                        {p.address || 'Various Locations'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-gray-700">Rs {p.price || '--'}</p>
                                                <p className="text-[10px] text-gray-400">Fixed Rate</p>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.isOtpVerified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {p.isOtpVerified ? 'Verified' : 'Unverified'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(p._id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Delete Provider"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminProviders;
