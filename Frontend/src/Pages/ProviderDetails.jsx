import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API, APIAuthenticated } from '../http';
import { Star, MapPin, Phone, Mail, ArrowLeft, Loader2, Calendar, Clock, CheckCircle2, AlertCircle, DollarSign } from 'lucide-react';
import Navbar from './Navbar';

const ProviderDetails = () => {
    const { providerId } = useParams();
    const navigate = useNavigate();
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [createdBooking, setCreatedBooking] = useState(null);
    const [reviews, setReviews] = useState([]);

    const [bookingDetails, setBookingDetails] = useState({
        date: '',
        time: '',
        message: ''
    });

    useEffect(() => {
        fetchProvider();
    }, [providerId]);

    const fetchProvider = async () => {
        try {
            setLoading(true);
            const res = await API.get(`/service/getservice/${providerId}`);
            if (res.data.data) {
                setProvider(res.data.data);
                setReviews(res.data.reviews || []);
            }
        } catch (err) {
            console.error("Error fetching provider:", err);
            setError("Failed to load provider details.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookingDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleConfirmBooking = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
            return;
        }

        if (!bookingDetails.date || !bookingDetails.time) {
            alert("Please select date and time");
            return;
        }

        try {
            setBookingLoading(true);
            const res = await APIAuthenticated.post('/booking/create', {
                service: provider.service,
                provider: provider.UserId._id,
                date: bookingDetails.date,
                time: bookingDetails.time,
                amount: provider.price,
                message: bookingDetails.message
            });

            if (res.data.success) {
                const booking = res.data.booking || {
                    _id: res.data.bookingId,
                    service: provider.service,
                    date: bookingDetails.date,
                    time: bookingDetails.time,
                    amount: provider.price,
                };
                setCreatedBooking(booking);
                setBookingSuccess(true);
            }
        } catch (err) {
            console.error("Booking error:", err);
            alert(err.response?.data?.message || "Failed to create booking");
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="w-12 h-12 text-[#FFB800] animate-spin" />
        </div>
    );

    if (error || !provider) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
            <div className="bg-red-50 border border-red-100 text-red-600 p-8 rounded-3xl max-w-md">
                <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                <p className="text-xl font-bold mb-2">Error</p>
                <p>{error || "Provider not found"}</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-[#FFB800] font-bold">Go Back</button>
            </div>
        </div>
    );

    const isAvailable = provider?.UserId?.isAvailable ?? true;
    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
        : 'New';

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center space-x-2 text-gray-500 hover:text-[#FFB800] transition-colors mb-8 font-semibold"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Provider Info & Reviews */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Provider Info Card */}
                            <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-sm">
                                <div className="flex items-center space-x-6 mb-8">
                                    <div className="w-24 h-24 rounded-3xl bg-yellow-50 flex items-center justify-center text-3xl font-bold text-[#FFB800]">
                                        {provider?.UserId?.firstName?.charAt(0) || 'P'}
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-3">
                                            <h1 className="text-3xl font-black text-gray-900">{provider?.UserId?.firstName} {provider?.UserId?.lastName}</h1>
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {isAvailable ? 'Available' : 'Unavailable'}
                                            </span>
                                        </div>
                                        <p className="text-[#FFB800] font-bold mt-1 text-lg">{provider?.service}</p>
                                        <div className="flex items-center space-x-2 mt-2">
                                            <div className="flex items-center text-[#FFB800]">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                        key={i} 
                                                        className={`w-4 h-4 ${i < (reviews.length > 0 ? Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) : 0) ? 'fill-current' : 'text-gray-300'}`} 
                                                    />
                                                ))}
                                                <span className="ml-2 text-gray-900 font-bold">
                                                    {averageRating === 'New' ? 'New Expert' : averageRating}
                                                </span>
                                                <span className="ml-1 text-gray-400 text-sm font-medium">({reviews.length} reviews)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">About the Service</h3>
                                        <p className="text-gray-600 leading-relaxed">{provider.description}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                                            <MapPin className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase">Location</p>
                                                <p className="text-sm font-bold text-gray-900">{provider?.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                                            <Phone className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase">Phone</p>
                                                <p className="text-sm font-bold text-gray-900">{provider?.UserId?.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                                            <Mail className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase">Email</p>
                                                <p className="text-sm font-bold text-gray-900">{provider?.UserId?.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                                            <DollarSign className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase">Rate</p>
                                                <p className="text-sm font-bold text-gray-900">Rs {provider?.price}/hr</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            onClick={() => navigate(`/chat/${provider.UserId._id}`)}
                                            className="w-full flex items-center justify-center space-x-2 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-100"
                                        >
                                            <Mail className="w-5 h-5" />
                                            <span>Chat with Provider</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Reviews Card */}
                            <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-sm space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black text-gray-900">Customer Reviews</h3>
                                    <div className="flex items-center space-x-2 bg-yellow-50 px-4 py-2 rounded-xl">
                                        <Star className="w-5 h-5 text-[#FFB800] fill-current" />
                                        <span className="text-lg font-black text-gray-900">
                                            {averageRating === 'New' ? '5.0' : averageRating}
                                        </span>
                                    </div>
                                </div>

                                {reviews.length > 0 ? (
                                    <div className="space-y-6">
                                        {reviews.map((review) => (
                                            <div key={review._id} className="p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:border-yellow-200 transition-all">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex space-x-3">
                                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 font-bold border border-gray-100">
                                                            {review.reviewerId?.firstName?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900">{review.reviewerId?.firstName} {review.reviewerId?.lastName}</p>
                                                            <div className="flex space-x-0.5 mt-0.5">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-400 font-medium">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                {review.feedback && (
                                                    <p className="text-gray-600 text-sm italic py-2 leading-relaxed">"{review.feedback}"</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center space-y-4">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                                            <Star className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="text-gray-900 font-bold">No Reviews Yet</p>
                                            <p className="text-gray-400 text-sm">This provider hasn't received any feedback yet.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Booking Widget */}
                        <div className="lg:col-span-1">
                            {bookingSuccess ? (
                                <div className="bg-white rounded-4xl p-8 border border-green-100 shadow-xl text-center space-y-5">
                                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Booking Created!</h3>
                                    <p className="text-gray-500 text-sm">Your booking has been sent to the provider. You can now proceed to payment.</p>
                                    <button
                                        onClick={() => navigate('/payment', { state: { booking: createdBooking } })}
                                        className="w-full bg-[#FFB800] text-white py-4 rounded-2xl font-black text-lg hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-100 flex items-center justify-center space-x-2"
                                    >
                                        <DollarSign className="w-5 h-5" />
                                        <span>Proceed to Payment</span>
                                    </button>
                                    <button
                                        onClick={() => navigate('/customer/bookings')}
                                        className="w-full bg-gray-50 text-gray-600 py-3 rounded-2xl font-bold hover:bg-gray-100 transition-all text-sm"
                                    >
                                        Pay Later
                                    </button>
                                </div>
                            ) : !isAvailable ? (
                                <div className="bg-white rounded-4xl p-8 border border-red-100 shadow-xl space-y-6">
                                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                                        <AlertCircle className="w-8 h-8 text-red-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Not Available</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">This provider is currently not available at the moment. Please look for other experts in this category.</p>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/service-category/${provider.service}`)}
                                        className="w-full bg-[#111827] text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-colors"
                                    >
                                        Browse Other Providers
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-xl space-y-6 sticky top-32">
                                    <h3 className="text-xl font-bold text-gray-900">Book Service</h3>

                                    <form onSubmit={handleConfirmBooking} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Select Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={bookingDetails.date}
                                                    onChange={handleInputChange}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-yellow-200 focus:outline-none transition-all font-medium text-sm"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Select Time</label>
                                            <div className="relative">
                                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="time"
                                                    name="time"
                                                    value={bookingDetails.time}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-yellow-200 focus:outline-none transition-all font-medium text-sm"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Message (Optional)</label>
                                            <textarea
                                                name="message"
                                                value={bookingDetails.message}
                                                onChange={handleInputChange}
                                                placeholder="Ask a question or provide details about the job..."
                                                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-yellow-200 focus:outline-none transition-all font-medium text-sm min-h-[100px] resize-none"
                                            ></textarea>
                                        </div>

                                        <div className="pt-4 border-t border-gray-50 mt-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-gray-500 text-sm">Service Rate:</span>
                                                <span className="font-bold text-gray-900">Rs {provider?.price || 0}/hr</span>
                                            </div>
                                            <div className="flex items-center justify-between mb-6">
                                                <span className="text-gray-500 text-sm">Service Fee:</span>
                                                <span className="font-bold text-gray-900">Rs 0</span>
                                            </div>
                                            <div className="flex items-center justify-between py-4 border-t border-dashed border-gray-100 mb-6">
                                                <span className="text-lg font-bold text-gray-900">Total</span>
                                                <span className="text-2xl font-black text-[#FFB800]">Rs {provider?.price || 0}</span>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={bookingLoading}
                                                className="w-full bg-[#FFB800] text-white py-4 rounded-2xl font-black text-lg hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-100 flex items-center justify-center space-x-2"
                                            >
                                                {bookingLoading ? (
                                                    <Loader2 className="w-6 h-6 animate-spin" />
                                                ) : (
                                                    <>
                                                        <span>Send Request</span>
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                    <p className="text-[10px] text-gray-400 text-center font-medium px-4">By confirming, you agree to our terms and conditions for booking this service.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderDetails;
