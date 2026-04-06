import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../Components/Dashboard/DashboardLayout';
import { CreditCard, Calendar, CheckCircle2, XCircle, Loader2, Search, Filter, Hash, FileText } from 'lucide-react';
import { APIAuthenticated, API } from '../http';

const CustomerPayments = () => {
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        if (userData?.email) {
            fetchPayments(userData.email);
        }
    }, []);

    const fetchPayments = async (email) => {
        try {
            setLoading(true);
            const res = await APIAuthenticated.get(`/payment/transactions/customer?email=${email}`);
            if (res.data.success) {
                setPayments(res.data.transactions);
            }
        } catch (error) {
            console.error("Error fetching payments:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
            case 'PENDING': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'FAILED': return 'bg-red-100 text-red-700 border-red-200';
            case 'REFUNDED': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    const filteredPayments = payments.filter(payment => {
        const searchStr = searchTerm.toLowerCase();
        return payment.product_name?.toLowerCase().includes(searchStr) ||
            payment.product_id?.toLowerCase().includes(searchStr);
    });

    return (
        <DashboardLayout role="customer" userName={user?.firstName || 'Customer'}>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Payment History</h1>
                        <p className="text-gray-500 mt-1">View and track all your transactions.</p>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by service or transaction ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-gray-100 rounded-2xl pl-11 pr-4 py-3 min-w-75 focus:outline-none focus:border-yellow-200 shadow-sm transition-all text-sm"
                        />
                    </div>
                </div>

                {/* Payments List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
                        <p className="text-gray-400 font-medium">Fetching your payments...</p>
                    </div>
                ) : filteredPayments.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredPayments.map((payment) => (
                            <div
                                key={payment._id}
                                className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm hover:border-yellow-100 transition-all group"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="flex items-start space-x-6">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-colors">
                                            <CreditCard className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-3 mb-1">
                                                <h3 className="text-xl font-black text-gray-900">{payment.product_name}</h3>
                                                <span className={`text-[10px] px-2.5 py-1 rounded-full border font-black uppercase tracking-wider ${getStatusStyles(payment.status)}`}>
                                                    {payment.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 font-medium flex items-center uppercase text-sm mt-1">
                                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded mr-2 font-bold">{payment.payment_gateway}</span>
                                            </p>

                                            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm font-bold text-gray-400">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    {new Date(payment.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center text-gray-200">•</div>
                                                <div className="flex items-center text-xs">
                                                    <Hash className="w-4 h-4 mr-1" />
                                                    {payment.product_id}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between lg:justify-end lg:space-x-8 pt-6 lg:pt-0 border-t lg:border-t-0 border-gray-50">
                                        <div className="text-right flex items-center space-x-4">
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Total Amount</p>
                                                <div className="text-2xl font-black text-[#FFB800]">Rs {payment.amount}</div>
                                            </div>
                                            {payment.status === 'COMPLETED' ? (
                                                (payment.booking_id || (payment.product_id && payment.product_id.includes('-'))) && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            const bId = payment.booking_id || (payment.product_id?.includes('-') ? payment.product_id.split('-')[1] : null);
                                                            if (bId) {
                                                                navigate(`/invoice/${bId}`);
                                                            } else {
                                                                alert("Could not identify the booking associated with this payment.");
                                                            }
                                                        }}
                                                        className="px-6 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-[#FFB800] transition-all shadow-lg active:scale-95 flex items-center space-x-2 whitespace-nowrap"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                        <span>View Invoice</span>
                                                    </button>
                                                )
                                            ) : payment.status === 'PENDING' ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        // Construct a basic booking object for the payment form
                                                        const booking = {
                                                            _id: payment.booking_id,
                                                            amount: payment.amount,
                                                            service: payment.product_name,
                                                            // We might not have date/time here, but PaymentForm uses them for display
                                                            date: new Date(payment.createdAt).toLocaleDateString(),
                                                            time: new Date(payment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                        };
                                                        navigate('/payment-form', { state: { booking } });
                                                    }}
                                                    className="px-6 py-2.5 rounded-xl bg-[#FFB800] text-white font-bold text-sm hover:bg-yellow-600 transition-all shadow-lg active:scale-95 flex items-center space-x-2 whitespace-nowrap animate-pulse"
                                                >
                                                    <CreditCard className="w-4 h-4" />
                                                    <span>Pay Rs {payment.amount}</span>
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-20 rounded-[2.5rem] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                            <Filter className="w-10 h-10 text-gray-200" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900">No Payments Found</h3>
                            <p className="text-gray-500 max-w-sm mt-2">
                                We couldn't find any completed transactions.
                            </p>
                        </div>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="bg-[#FFB800] text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-yellow-100 hover:bg-yellow-500 transition-all"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default CustomerPayments;
