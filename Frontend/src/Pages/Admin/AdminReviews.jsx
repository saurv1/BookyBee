import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../Components/Dashboard/DashboardLayout';
import { Star, MessageSquare, Loader2, Quote, Search } from 'lucide-react';
import { APIAuthenticated } from '../../http';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('All');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await APIAuthenticated.get('/review/admin/all');
            if (res.data.success) {
                setReviews(res.data.reviews);
            }
        } catch (error) {
            console.error("Error fetching admin reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = ['All', 'customer', 'provider']; // Note: role indicates who is being rated OR who is reviewing. In review route, role is either customer or provider rating. Wait, `role` is the role of the person being rated based on Context.

    const filteredReviews = reviews.filter(r => {
        const matchesTab = activeTab === 'All' || r.role === activeTab;
        const searchStr = searchTerm.toLowerCase();
        const reviewerName = r.reviewerId ? `${r.reviewerId.firstName} ${r.reviewerId.lastName}`.toLowerCase() : '';
        const targetName = r.targetId ? `${r.targetId.firstName} ${r.targetId.lastName}`.toLowerCase() : '';
        const serviceName = r.bookingId?.service?.toLowerCase() || '';

        return matchesTab && (reviewerName.includes(searchStr) || targetName.includes(searchStr) || serviceName.includes(searchStr));
    });

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <DashboardLayout role="admin" userName="Admin">
            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Platform Reviews</h1>
                        <p className="text-gray-500 mt-1">Monitor all feedback strictly left across BookyBee.</p>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search names, services..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-gray-100 rounded-2xl pl-11 pr-4 py-3 min-w-75 focus:outline-none focus:border-yellow-200 shadow-sm transition-all text-sm w-full md:w-auto"
                        />
                    </div>
                </div>

                {/* Overall Stats Widget */}
                <div className="bg-[#111827] rounded-3xl p-8 text-white shadow-xl flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 font-bold uppercase tracking-wider mb-2">Global Satisfaction Rate</p>
                        <div className="flex items-center space-x-4">
                            <h2 className="text-5xl font-black text-[#FFB800] tracking-tight">{averageRating}</h2>
                            <div className="flex space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-8 h-8 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-4xl font-black text-gray-100">{reviews.length}</p>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mt-1">Total Reviews</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => setActiveTab('All')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'All'
                                ? 'bg-yellow-500 text-white shadow-lg'
                                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
                            }`}
                    >
                        All Reviews
                    </button>
                    <button
                        onClick={() => setActiveTab('customer')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'customer'
                                ? 'bg-yellow-500 text-white shadow-lg'
                                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
                            }`}
                    >
                        Reviews by Customers
                    </button>
                    <button
                        onClick={() => setActiveTab('provider')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'provider'
                                ? 'bg-yellow-500 text-white shadow-lg'
                                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
                            }`}
                    >
                        Reviews by Providers
                    </button>
                </div>

                {/* Reviews List */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
                            <p className="text-gray-400 font-medium">Fetching global reviews...</p>
                        </div>
                    ) : filteredReviews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredReviews.map((review) => (
                                <div key={review._id} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-yellow-200 hover:shadow-md transition-all flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex space-x-1.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                                ))}
                                            </div>
                                            <span className="text-[10px] px-2.5 py-1 uppercase tracking-wider font-black rounded-full bg-yellow-100 text-yellow-700">
                                                {review.role === 'customer' ? 'Customer to Provider' : 'Provider to Customer'}
                                            </span>
                                        </div>
                                        {review.feedback ? (
                                            <p className="text-gray-700 font-medium leading-relaxed italic relative mb-6">
                                                <Quote className="w-8 h-8 text-yellow-100 absolute -top-2 -left-2 -z-10" />
                                                "{review.feedback}"
                                            </p>
                                        ) : (
                                            <p className="text-gray-400 font-medium italic mb-6">No feedback provided</p>
                                        )}
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-black">Reviewed User</p>
                                                <p className="font-bold text-gray-900">{review.targetId?.firstName} {review.targetId?.lastName}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 uppercase font-black">Reviewer</p>
                                                <p className="text-gray-600 font-medium text-sm">{review.reviewerId?.firstName} {review.reviewerId?.lastName}</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between text-xs text-gray-500 font-medium bg-white p-2 rounded-lg border border-gray-100">
                                            <span>{review.bookingId?.service || 'Deleted Service'}</span>
                                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 p-20 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                            <Star className="w-16 h-16 text-gray-300 mb-6" />
                            <h3 className="text-2xl font-black text-gray-900">No matching reviews</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mt-2 font-medium">
                                We couldn't find any reviews matching your current filters.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminReviews;
