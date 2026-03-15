import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Components/Dashboard/DashboardLayout';
import { Star, MessageSquare, Loader2, Quote } from 'lucide-react';
import { APIAuthenticated } from '../http';

const ProviderReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        if (userData?._id) {
            fetchReviews(userData._id);
        }
    }, []);

    const fetchReviews = async (userId) => {
        try {
            setLoading(true);
            const res = await APIAuthenticated.get(`/review/target/${userId}`);
            if (res.data.success) {
                setReviews(res.data.reviews);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <DashboardLayout role="provider" userName={user?.firstName || 'Provider'}>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">My Reviews</h1>
                        <p className="text-gray-500 mt-1">Check out what customers are saying about your work.</p>
                    </div>
                </div>

                {reviews.length > 0 && (
                    <div className="bg-[#111827] rounded-3xl p-8 text-white shadow-xl flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 font-bold uppercase tracking-wider mb-2">Overall Rating</p>
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
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Total Reviews</p>
                        </div>
                    </div>
                )}

                {/* Reviews List */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                    {loading ? (
                        <div className="flex justify-center flex-col items-center py-20 space-y-4">
                            <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
                            <p className="text-gray-400 font-medium">Loading reviews...</p>
                        </div>
                    ) : reviews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reviews.map((review) => (
                                <div key={review._id} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-yellow-200 hover:shadow-md transition-all">
                                    <div className="flex space-x-3 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                        ))}
                                    </div>
                                    {review.feedback ? (
                                        <p className="text-gray-700 font-medium leading-relaxed italic relative">
                                            <Quote className="w-8 h-8 text-yellow-100 absolute -top-2 -left-2 -z-10" />
                                            "{review.feedback}"
                                        </p>
                                    ) : (
                                        <p className="text-gray-400 font-medium italic">No feedback provided</p>
                                    )}
                                    <div className="mt-8 flex items-center justify-between pt-4 border-t border-gray-200">
                                        <div>
                                            <p className="text-gray-900 font-bold">
                                                {review.reviewerId?.firstName} {review.reviewerId?.lastName}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {review.bookingId?.service} • {new Date(review.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 p-20 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                            <Star className="w-16 h-16 text-gray-300 mb-6" />
                            <h3 className="text-2xl font-black text-gray-900">No reviews yet</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mt-2 font-medium">
                                Deliver great service to get amazing 5-star reviews from your customers!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProviderReviews;
