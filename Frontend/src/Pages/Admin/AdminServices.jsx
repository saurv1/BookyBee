import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../Components/Dashboard/DashboardLayout';
import { 
    Wrench, 
    Users, 
    Calendar, 
    TrendingUp, 
    Search, 
    Filter,
    ChevronRight,
    Loader2,
    DollarSign
} from 'lucide-react';
import { APIAuthenticated } from '../../http';

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const res = await APIAuthenticated.get('/service/admin/services');
            if (res.data.success) {
                setServices(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredServices = services.filter(service => 
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <DashboardLayout role="admin" userName="Admin">
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                    <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Loading Services...</p>
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
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Platform Services</h1>
                        <p className="text-gray-500 mt-1 font-medium italic">Overview of services and provider distribution.</p>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search services..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all outline-none"
                        />
                    </div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service) => (
                        <div 
                            key={service.name}
                            className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-yellow-200 transition-all group overflow-hidden relative"
                        >
                            {/* Decorative Background Icon */}
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                                <Wrench className="w-32 h-32" />
                            </div>

                            <div className="flex items-start justify-between mb-6">
                                <div className="p-4 bg-yellow-50 rounded-2xl text-yellow-600 transition-colors group-hover:bg-yellow-500 group-hover:text-white">
                                    <Wrench className="w-6 h-6" />
                                </div>
                                <div className="flex items-center space-x-1 text-green-500 text-sm font-bold bg-green-50 px-3 py-1 rounded-full">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>Active</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-gray-900 mb-2 truncate">{service.name}</h3>
                            <p className="text-gray-400 text-sm font-medium mb-6">Registered service category</p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-2xl group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-100">
                                    <div className="flex items-center space-x-2 text-gray-400 mb-1">
                                        <Users className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-wider">Providers</span>
                                    </div>
                                    <p className="text-lg font-black text-gray-900">{service.providerCount}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-100">
                                    <div className="flex items-center space-x-2 text-gray-400 mb-1">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-wider">Bookings</span>
                                    </div>
                                    <p className="text-lg font-black text-gray-900">{service.bookingCount}</p>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                                <div>
                                    <div className="flex items-center space-x-1 text-gray-400 mb-0.5">
                                        <DollarSign className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Revenue</span>
                                    </div>
                                    <p className="text-md font-black text-gray-800">Rs {service.revenue.toLocaleString()}</p>
                                </div>
                                <button className="p-2 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredServices.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                            <Search className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">No services found</h3>
                        <p className="text-gray-400 mt-1">Try adjusting your search criteria</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AdminServices;
