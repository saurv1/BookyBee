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
                const user = JSON.parse(localStorage.getItem('user'));
                const userDistrict = user?.district || "";
                const userAddress = user?.address || "";
                
                let sortedProviders = [...res.data.data];

                if (userDistrict || userAddress) {
                    sortedProviders.sort((a, b) => {
                        // Priority 1: Exact district match
                        const aDistrictMatch = userDistrict && (a.district?.toLowerCase() === userDistrict.toLowerCase() || a.UserId?.district?.toLowerCase() === userDistrict.toLowerCase());
                        const bDistrictMatch = userDistrict && (b.district?.toLowerCase() === userDistrict.toLowerCase() || b.UserId?.district?.toLowerCase() === userDistrict.toLowerCase());
                        
                        if (aDistrictMatch && !bDistrictMatch) return -1;
                        if (!aDistrictMatch && bDistrictMatch) return 1;

                        // Priority 2: Address includes customer's address string
                        const aAddressMatch = userAddress && (a.location?.toLowerCase().includes(userAddress.toLowerCase()) || a.UserId?.address?.toLowerCase().includes(userAddress.toLowerCase()));
                        const bAddressMatch = userAddress && (b.location?.toLowerCase().includes(userAddress.toLowerCase()) || b.UserId?.address?.toLowerCase().includes(userAddress.toLowerCase()));
                        
                        if (aAddressMatch && !bAddressMatch) return -1;
                        if (!aAddressMatch && bAddressMatch) return 1;

                        return 0;
                    });
                }
                
                setProviders(sortedProviders);
            }
        } catch (err) {
            console.error("Error fetching providers:", err);
            setError("Failed to load providers for this category.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 md:pt-32 pb-10 md:pb-20 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate('/services')}
                    className="flex items-center space-x-2 text-gray-500 hover:text-[#FFB800] transition-colors mb-6 md:mb-8 font-semibold"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm md:text-base">Back to Services</span>
                </button>

                <div className="mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-2">{categoryName} Experts</h1>
                    <p className="text-sm md:text-base text-gray-500">Find the best professionals for your {categoryName.toLowerCase()} needs.</p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-10 md:py-20">
                        <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-[#FFB800] animate-spin mb-4" />
                        <p className="text-gray-400 font-medium">Finding experts for you...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-2xl text-center shadow-lg">
                        {error}
                    </div>
                ) : providers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {providers.map((item) => (
                            <div key={item._id} className="bg-white rounded-3xl md:rounded-4xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 rounded-2xl bg-yellow-50 flex items-center justify-center text-2xl font-bold text-[#FFB800] group-hover:scale-110 transition-transform">
                                            {item?.UserId?.firstName?.charAt(0) || 'P'}
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <h3 className="text-xl font-bold text-gray-900">{item?.UserId?.firstName} {item?.UserId?.lastName}</h3>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${item?.UserId?.isAvailable ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                                    {item?.UserId?.isAvailable ? 'Available' : 'Unavailable'}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-sm font-bold text-gray-800 mt-1">
                                                <Star className={`w-4 h-4 ${item?.rating > 0 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                                <span>{item?.rating > 0 ? item?.rating?.toFixed(1) : 'New'}</span>
                                                <span className="text-gray-400 font-medium ml-1">({item?.reviewCount} reviews)</span>
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
                                        <span>{item?.UserId?.phone || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-gray-500 text-sm text-wrap truncate">
                                        <Mail className="w-4 h-4" />
                                        <span>{item?.UserId?.email || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-50 gap-4">
                                    <div className="text-[#FFB800] font-black text-2xl">
                                        Rs {item.price}<span className="text-xs text-gray-400 font-bold">/hr</span>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/provider-details/${item._id}`)}
                                        className="w-full sm:w-auto bg-[#111827] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#FFB800] transition-all shadow-lg active:scale-95"
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
