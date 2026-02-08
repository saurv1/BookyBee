import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../http';
import { Star, MapPin, Phone, Mail, ArrowLeft, Loader2 } from 'lucide-react';

const CategoryProviders = () => {
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProviders();
    }, [categoryName]);

    const fetchProviders = async () => {
        try {
            setLoading(true);
            const res = await API.get(`/service/getservicesbycategory/${categoryName}`);
            if (res.data.data) {
                setProviders(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching providers:", err);
            setError("Failed to load providers for this category.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate('/services')}
                    className="flex items-center space-x-2 text-gray-500 hover:text-[#FFB800] transition-colors mb-8 font-semibold"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Services</span>
                </button>

                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold text-[#111827] mb-2">{categoryName} Experts</h1>
                    <p className="text-gray-500">Find the best professionals for your {categoryName.toLowerCase()} needs.</p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-[#FFB800] animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Finding experts for you...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-2xl text-center">
                        {error}
                    </div>
                ) : providers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {providers.map((item) => (
                            <div key={item._id} className="bg-white rounded-4xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 rounded-2xl bg-yellow-50 flex items-center justify-center text-2xl font-bold text-[#FFB800] group-hover:scale-110 transition-transform">
                                            {item.UserId.firstName.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{item.UserId.firstName} {item.UserId.lastName}</h3>
                                            <div className="flex items-center space-x-1 text-sm font-bold text-gray-800 mt-1">
                                                <Star className={`w-4 h-4 ${item.rating > 0 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                                <span>{item.rating > 0 ? item.rating.toFixed(1) : 'New'}</span>
                                                <span className="text-gray-400 font-medium ml-1">({item.reviewCount} reviews)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center space-x-3 text-gray-500 text-sm">
                                        <MapPin className="w-4 h-4" />
                                        <span>{item.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-gray-500 text-sm">
                                        <Phone className="w-4 h-4" />
                                        <span>{item.UserId.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-gray-500 text-sm text-wrap truncate">
                                        <Mail className="w-4 h-4" />
                                        <span>{item.UserId.email}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                    <div className="text-[#FFB800] font-black text-xl">
                                        Rs {item.price}<span className="text-xs text-gray-400 font-bold">/hr</span>
                                    </div>
                                    <button
                                        className="bg-[#111827] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#FFB800] transition-colors shadow-lg shadow-gray-100"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[40px] p-20 text-center border-2 border-dashed border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No experts found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-8">We couldn't find any registered providers for {categoryName} in your area at the moment.</p>
                        <button
                            onClick={() => navigate('/services')}
                            className="text-[#FFB800] font-bold hover:underline"
                        >
                            Try browsing other services
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryProviders;
