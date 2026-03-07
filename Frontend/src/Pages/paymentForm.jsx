import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Shield, ArrowLeft, Loader2, Smartphone, Wallet, CheckCircle2, AlertCircle } from 'lucide-react';
import { API } from '../http';

const PaymentForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedGateway, setSelectedGateway] = useState('');
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const [bookingData, setBookingData] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            navigate('/login');
            return;
        }
        setUser(userData);

        // Get booking data from navigation state
        if (location.state?.booking) {
            setBookingData(location.state.booking);
        } else {
            navigate('/customer-dashboard');
        }
    }, [location.state, navigate]);

    const handlePayment = async () => {
        if (!selectedGateway) {
            setError('Please select a payment method');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const res = await API.post('/payment/initiate-payment', {
                amount: bookingData.amount,
                bookingId: bookingData._id,
                paymentGateway: selectedGateway,
                customerName: `${user.firstName} ${user.lastName}`,
                customerEmail: user.email,
                customerPhone: user.phone || '9800000000',
                productName: bookingData.service,
            });

            if (res.data?.url) {
                // Store payment info for verification on return
                localStorage.setItem('pendingPayment', JSON.stringify({
                    product_id: res.data.product_id,
                    pidx: res.data.pidx,
                    booking_id: bookingData._id,
                    gateway: selectedGateway,
                }));
                // Redirect to payment gateway
                window.location.href = res.data.url;
            } else {
                setError('Failed to get payment URL. Please try again.');
            }
        } catch (err) {
            console.error('Payment error:', err);
            setError(err.response?.data?.message || 'Payment initiation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!bookingData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
            </div>
        );
    }

    const gateways = [
        {
            id: 'khalti',
            name: 'Khalti',
            description: 'Pay with Khalti digital wallet',
            color: '#5C2D91',
            icon: <Wallet className="w-6 h-6" />,
        },
        {
            id: 'esewa',
            name: 'eSewa',
            description: 'Pay with eSewa mobile wallet',
            color: '#60BB46',
            icon: <Smartphone className="w-6 h-6" />,
        },
    ];

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-yellow-50/30">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-gray-900">Complete Payment</h1>
                        <p className="text-sm text-gray-500">Secure checkout for your booking</p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Payment Methods */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-[#FFB800]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Select Payment Method</h2>
                                    <p className="text-sm text-gray-500">Choose your preferred payment gateway</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {gateways.map((gw) => (
                                    <button
                                        key={gw.id}
                                        onClick={() => { setSelectedGateway(gw.id); setError(''); }}
                                        className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left group ${selectedGateway === gw.id
                                                ? 'border-[#FFB800] bg-yellow-50/50 shadow-lg shadow-yellow-100/50'
                                                : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                                            }`}
                                    >
                                        <div
                                            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white transition-transform duration-300 ${selectedGateway === gw.id ? 'scale-110' : 'group-hover:scale-105'
                                                }`}
                                            style={{ backgroundColor: gw.color }}
                                        >
                                            {gw.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 text-lg">{gw.name}</h3>
                                            <p className="text-sm text-gray-500">{gw.description}</p>
                                        </div>
                                        <div
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedGateway === gw.id
                                                    ? 'border-[#FFB800] bg-[#FFB800]'
                                                    : 'border-gray-300'
                                                }`}
                                        >
                                            {selectedGateway === gw.id && (
                                                <CheckCircle2 className="w-4 h-4 text-white" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Error Display */}
                            {error && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                                    <p className="text-sm text-red-600 font-medium">{error}</p>
                                </div>
                            )}

                            {/* Security Notice */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-2xl flex items-center gap-3">
                                <Shield className="w-5 h-5 text-gray-400 shrink-0" />
                                <p className="text-xs text-gray-500">
                                    Your payment is secured with 256-bit encryption. We never store your payment credentials.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-gray-900">{bookingData.service}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {bookingData.date} • {bookingData.time}
                                        </p>
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100" />

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Service Fee</span>
                                    <span className="font-bold text-gray-900">Rs {bookingData.amount}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Tax</span>
                                    <span className="font-bold text-gray-900">Rs 0</span>
                                </div>

                                <div className="h-px bg-gray-100" />

                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-black text-[#FFB800]">Rs {bookingData.amount}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={loading || !selectedGateway}
                                className={`w-full py-4 rounded-2xl font-bold text-white text-lg transition-all duration-300 flex items-center justify-center gap-2 ${loading || !selectedGateway
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-[#111827] hover:bg-[#FFB800] shadow-lg hover:shadow-xl active:scale-[0.98]'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        Pay Rs {bookingData.amount}
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-center text-gray-400 mt-4">
                                By proceeding, you agree to our Terms of Service
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentForm;
