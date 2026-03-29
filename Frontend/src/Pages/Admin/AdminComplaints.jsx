import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../Components/Dashboard/DashboardLayout';
import { AlertCircle, Search, Loader2, User, Clock, CheckCircle2, XCircle, MoreVertical } from 'lucide-react';
import { APIAuthenticated } from '../../http';

const AdminComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const res = await APIAuthenticated.get('/complaint');
            if (res.data.success) {
                setComplaints(res.data.complaints);
            }
        } catch (error) {
            console.error("Error fetching complaints:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const res = await APIAuthenticated.patch(`/complaint/${id}`, { status });
            if (res.data.success) {
                setComplaints(complaints.map(c => c._id === id ? { ...c, status } : c));
            }
        } catch (error) {
            console.error("Error updating complaint status:", error);
        }
    };

    const filteredComplaints = (complaints || []).filter(c => {
        if (!c) return false;
        
        const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
        const searchStr = searchTerm.toLowerCase();
        
        const firstName = c.user?.firstName || '';
        const lastName = c.user?.lastName || '';
        const userName = `${firstName} ${lastName}`.toLowerCase();
        const subject = (c.subject || '').toLowerCase();
        const message = (c.message || '').toLowerCase();
        const email = (c.user?.email || '').toLowerCase();
        
        return matchesStatus && (
            userName.includes(searchStr) || 
            subject.includes(searchStr) || 
            message.includes(searchStr) ||
            email.includes(searchStr)
        );
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Resolved': return 'bg-green-100 text-green-700 border-green-200';
            case 'Dismissed': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <DashboardLayout role="admin" userName="Admin">
            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">User Complaints</h1>
                        <p className="text-gray-500 mt-1 font-medium">Manage and resolve issues reported by customers and providers.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search complaints..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white border border-gray-100 rounded-2xl pl-11 pr-4 py-3 min-w-[300px] focus:outline-none focus:border-yellow-200 shadow-sm transition-all text-sm font-medium"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-white border border-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-yellow-200 shadow-sm transition-all text-sm font-bold text-gray-700"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Dismissed">Dismissed</option>
                        </select>
                    </div>
                </div>

                {/* Complaints List */}
                <div className="grid grid-cols-1 gap-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
                            <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Loading complaints...</p>
                        </div>
                    ) : filteredComplaints.length > 0 ? (
                        filteredComplaints.map((complaint) => (
                            <div key={complaint._id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row">
                                {/* Left Side - User Info */}
                                <div className="md:w-72 p-8 bg-gray-50/50 border-r border-gray-50 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-sm">
                                                <User className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Submitted By</p>
                                                <p className="font-bold text-gray-900 truncate max-w-[140px]">{complaint.user?.firstName} {complaint.user?.lastName}</p>
                                            </div>
                                        </div>
                                        <div className="inline-flex items-center px-3 py-1 bg-white rounded-full border border-gray-100 text-[10px] font-black uppercase tracking-wider text-gray-500">
                                            {complaint.user?.role}
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                                        <div className="flex items-center space-x-2 text-gray-400">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className={`inline-block px-4 py-1.5 rounded-full border text-[11px] font-black uppercase tracking-widest ${getStatusColor(complaint.status)}`}>
                                            {complaint.status}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side - Content */}
                                <div className="flex-1 p-8 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-black text-gray-900 leading-tight">{complaint.subject}</h3>
                                        <div className="flex space-x-2">
                                            {complaint.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(complaint._id, 'Resolved')}
                                                        className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors shadow-sm"
                                                        title="Mark as Resolved"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(complaint._id, 'Dismissed')}
                                                        className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors shadow-sm"
                                                        title="Dismiss Complaint"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}
                                            {complaint.status !== 'Pending' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(complaint._id, 'Pending')}
                                                    className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors shadow-sm"
                                                    title="Set back to Pending"
                                                >
                                                    <Clock className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50/50 rounded-2xl p-6 flex-1 border border-gray-50">
                                        <p className="text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">{complaint.message}</p>
                                    </div>
                                    <div className="mt-4 flex items-center space-x-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
                                        <span>User Email:</span>
                                        <span className="text-gray-600">{complaint.user?.email || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-6">
                                <AlertCircle className="w-10 h-10 text-yellow-400" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900">All clear!</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mt-2 font-medium text-lg">
                                We couldn't find any complaints matching your current filters. Great job!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminComplaints;
