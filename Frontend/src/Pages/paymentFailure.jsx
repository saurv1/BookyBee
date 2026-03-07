import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, ArrowRight, Home, RefreshCw, AlertTriangle } from 'lucide-react';
import { API } from '../http';

const PaymentFailure = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        // Update payment status to FAILED
        updatePaymentStatus();
    }, []);

    const updatePaymentStatus = async () => {
        try {
            const pendingPayment = JSON.parse(localStorage.getItem('pendingPayment'));
            if (pendingPayment) {
                await API.post('/payment/payment-status', {
                    product_id: pendingPayment.product_id,
                    pidx: pendingPayment.pidx,
                    status: 'FAILED',
                });
                // Clean up
                localStorage.removeItem('pendingPayment');
            }
        } catch (err) {
            console.error('Error updating failed payment status:', err);
        }
    };

    const handleRetry = () => {
        // Go back to booking history so user can try paying again
        navigate('/customer/bookings');
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-red-50/30 flex items-center justify-center px-4">
            <div className="max-w-lg w-full">
                <div className="bg-white rounded-4xl p-10 border border-gray-100 shadow-xl text-center space-y-8">
                    {/* Failure Icon */}
                    <div className="relative">
                        <div className="w-24 h-24 mx-auto bg-linear-to-br from-red-400 to-rose-500 rounded-full flex items-center justify-center shadow-xl shadow-red-200/50">
                            <XCircle className="w-12 h-12 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center shadow-lg">
                            <AlertTriangle className="w-4 h-4 text-white" />
                        </div>
                    </div>

                    <div>
                        <h1 className="text-3xl font-black text-gray-900">Payment Failed</h1>
                        <p className="text-gray-500 mt-3 text-lg">
                            Unfortunately, your payment could not be processed. Don't worry — no amount has been deducted from your account.
                        </p>
                    </div>

                    {/* Common Reasons */}
                    <div className="bg-red-50/60 rounded-2xl p-6 text-left space-y-3">
                        <h3 className="font-bold text-red-700 text-sm uppercase tracking-wider">Possible Reasons</h3>
                        <ul className="space-y-2 text-sm text-red-600">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                Insufficient balance in your wallet
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                Transaction was cancelled or timed out
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                Network connection issue during payment
                            </li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={handleRetry}
                            className="w-full py-4 rounded-2xl bg-[#111827] text-white font-bold text-lg hover:bg-[#FFB800] transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Try Again
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

                    <p className="text-xs text-gray-400">
                        If the issue persists, please contact our support team for assistance.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure;
