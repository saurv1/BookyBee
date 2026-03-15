import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Star, Loader2, CheckCircle } from 'lucide-react';
import { APIAuthenticated } from '../http';

const RatingFeedback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { booking, role } = location.state || {};

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    if (!booking) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-yellow-50/30 flex justify-center items-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Invalid Request.</p>
                    <button onClick={() => navigate('/')} className="px-6 py-2 bg-[#FFB800] text-white rounded-xl shadow-lg font-bold">Return Home</button>
                </div>
            </div>
        );
    }

    const targetUser = role === 'provider' ? booking.customer : booking.provider;
    const reviewerId = role === 'provider' ? booking.provider?._id || booking.provider : booking.customer?._id || booking.customer;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please select a rating of at least 1 star');
            return;
        }

        try {
            setLoading(true);
            const res = await APIAuthenticated.post('/review/add', {
                bookingId: booking._id,
                reviewerId: reviewerId,
                targetId: targetUser?._id,
                role: role,
                rating: rating,
                feedback: feedback
            });

            if (res.data.success) {
                setSubmitted(true);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to submit feedback');
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = () => {
        if (role === 'provider') {
            navigate('/service-provider');
        } else {
            navigate('/customer-dashboard');
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-yellow-50/30 flex items-center justify-center px-4 pt-20">
                <div className="bg-white p-10 rounded-4xl shadow-xl text-center max-w-md w-full border border-gray-100">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Thank You!</h2>
                    <p className="text-gray-500 mb-8">Your feedback has been submitted successfully.</p>
                    <button
                        onClick={handleContinue}
                        className="w-full bg-[#111827] text-white py-4 rounded-xl font-bold hover:bg-[#FFB800] transition-all shadow-lg"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-yellow-50/30 flex items-center justify-center px-4 pt-20">
            <div className="bg-white p-8 md:p-10 rounded-4xl shadow-xl max-w-lg w-full border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-gray-900">Rate Your Experience</h1>
                    <p className="text-gray-500 mt-2">
                        How was your experience with {targetUser?.firstName}?
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex justify-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                type="button"
                                key={star}
                                className="transition-all hover:scale-110 focus:outline-none"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(rating)}
                            >
                                <Star
                                    className={`w-12 h-12 ${(hover || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} transition-colors`}
                                />
                            </button>
                        ))}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Leave a Feedback (Optional)</label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows="4"
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 focus:outline-none focus:border-yellow-400 focus:bg-white transition-all resize-none"
                            placeholder="Tell us about your experience..."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#FFB800] text-white py-4 rounded-2xl font-black hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-100 flex items-center justify-center space-x-2"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <span>Submit Rating</span>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RatingFeedback;
