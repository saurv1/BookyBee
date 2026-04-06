import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Loader2, Home, Calendar, CreditCard, Sparkles, FileText } from 'lucide-react';
import { API } from '../http';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [verifying, setVerifying] = useState(true);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState('');
    const [transactionInfo, setTransactionInfo] = useState(null);
    const [bookingForRating, setBookingForRating] = useState(null);

    useEffect(() => {
        verifyPayment();
    }, []);

    const verifyPayment = async () => {
        try {
            // Get stored payment info
            const pendingPayment = JSON.parse(localStorage.getItem('pendingPayment'));

            if (!pendingPayment) {
                setError('No pending payment found');
                setVerifying(false);
                return;
            }

            // Get params from URL (payment gateways redirect with these)
            let pidx = searchParams.get('pidx') || searchParams.get('transaction_id');
            let product_id = searchParams.get('purchase_order_id') || searchParams.get('oid') || searchParams.get('transaction_uuid');

            // Handle eSewa v2 'data' parameter (Base64 encoded JSON)
            const dataParam = searchParams.get('data');
            if (dataParam) {
                try {
                    const decodedData = JSON.parse(atob(dataParam));
                    if (decodedData.transaction_uuid) product_id = decodedData.transaction_uuid;
                    if (decodedData.transaction_id) pidx = decodedData.transaction_id;
                } catch (e) {
                    console.error("Error decoding eSewa data:", e);
                }
            }

            // Fallback to localStorage if URL params are missing
            pidx = pidx || pendingPayment.pidx;
            product_id = product_id || pendingPayment.product_id;

            const res = await API.post('/payment/payment-status', {
                product_id,
                pidx,
                status: 'SUCCESS',
            });

            if (res.data?.status === 'COMPLETED') {
                setVerified(true);
                setTransactionInfo(res.data.transaction || {
                    amount: pendingPayment.amount,
                    gateway: pendingPayment.gateway,
                });
                if (pendingPayment.booking) {
                    setBookingForRating(pendingPayment.booking);
                }
                // Clean up
                localStorage.removeItem('pendingPayment');

                // Auto redirect after 3 seconds
                setTimeout(() => {
                    navigate('/rating-feedback', { 
                        state: { 
                            booking: pendingPayment.booking, 
                            role: 'customer' 
                        } 
                    });
                }, 3000);
            } else {
                setError('Payment verification failed. Please contact support.');
            }
        } catch (err) {
            console.error('Verification error:', err);
            setError(err.response?.data?.message || 'Failed to verify payment');
        } finally {
            setVerifying(false);
        }
    };

    if (verifying) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-yellow-50/30 flex items-center justify-center">
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 mx-auto bg-yellow-50 rounded-full flex items-center justify-center animate-pulse">
                        <Loader2 className="w-10 h-10 text-[#FFB800] animate-spin" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Verifying Payment</h2>
                        <p className="text-gray-500 mt-2">Please wait while we confirm your transaction...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-green-50/30 flex items-center justify-center px-4">
            <div className="max-w-lg w-full">
                {verified ? (
                    <div className="bg-white rounded-4xl p-10 border border-gray-100 shadow-xl text-center space-y-8">
                        {/* Success Animation */}
                        <div className="relative">
                            <div className="w-24 h-24 mx-auto bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-green-200/50">
                                <CheckCircle2 className="w-12 h-12 text-white" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#FFB800] rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        <div>
                            <h1 className="text-3xl font-black text-gray-900">Payment Successful!</h1>
                            <p className="text-gray-500 mt-3 text-lg">
                                Your booking has been confirmed and payment has been processed successfully.
                            </p>
                        </div>

                        {/* Transaction Details */}
                        {transactionInfo && (
                            <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-3">
                                <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider">Transaction Details</h3>
                                {transactionInfo.product_name && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Service</span>
                                        <span className="font-bold text-gray-900">{transactionInfo.product_name}</span>
                                    </div>
                                )}
                                {transactionInfo.amount && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Amount Paid</span>
                                        <span className="font-black text-[#FFB800] text-lg">Rs {transactionInfo.amount}</span>
                                    </div>
                                )}
                                {transactionInfo.payment_gateway && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Payment Method</span>
                                        <span className="font-bold text-gray-900 capitalize">{transactionInfo.payment_gateway}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="space-y-3">
                            {bookingForRating ? (
                                <button
                                    onClick={() => navigate('/rating-feedback', { state: { booking: bookingForRating, role: 'customer' } })}
                                    className="w-full py-4 rounded-2xl bg-[#FFB800] text-white font-black text-lg hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-100 flex items-center justify-center gap-2 active:scale-[0.98]"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Rate {bookingForRating.provider?.firstName || 'Provider'}
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            ) : null}

                            <button
                                onClick={() => navigate('/customer/bookings')}
                                className="w-full py-4 rounded-2xl bg-[#111827] text-white font-bold text-lg hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
                            >
                                <Calendar className="w-5 h-5" />
                                View My Bookings
                            </button>

                            {bookingForRating && (
                                <button
                                    onClick={() => navigate(`/invoice/${bookingForRating._id}`)}
                                    className="w-full py-4 rounded-2xl bg-white border-2 border-gray-100 text-gray-700 font-bold text-lg hover:border-[#FFB800] hover:text-[#FFB800] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                                >
                                    <FileText className="w-5 h-5" />
                                    Generate Invoice
                                </button>
                            )}

                            <button
                                onClick={() => navigate('/')}
                                className="w-full py-4 rounded-2xl bg-gray-50 text-gray-700 font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                            >
                                <Home className="w-5 h-5" />
                                Back to Home
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-4xl p-10 border border-gray-100 shadow-xl text-center space-y-8">
                        <div className="w-24 h-24 mx-auto bg-linear-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl shadow-orange-200/50">
                            <CreditCard className="w-12 h-12 text-white" />
                        </div>

                        <div>
                            <h1 className="text-3xl font-black text-gray-900">Verification Issue</h1>
                            <p className="text-gray-500 mt-3 text-lg">
                                {error || 'We could not verify your payment at this time.'}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/customer/bookings')}
                                className="w-full py-4 rounded-2xl bg-[#111827] text-white font-bold hover:bg-[#FFB800] transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                Check Booking Status
                                <ArrowRight className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => navigate('/')}
                                className="w-full py-4 rounded-2xl bg-gray-50 text-gray-700 font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                            >
                                <Home className="w-5 h-5" />
                                Back to Home
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;
