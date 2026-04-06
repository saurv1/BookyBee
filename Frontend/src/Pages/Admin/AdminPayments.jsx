import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../Components/Dashboard/DashboardLayout';
import { CreditCard, Search, Loader2, Calendar, Hash } from 'lucide-react';
import { APIAuthenticated } from '../../http';

const AdminPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const res = await APIAuthenticated.get('/payment/transactions/admin');
            if (res.data.success) {
                setPayments(res.data.transactions);
            }
        } catch (error) {
            console.error("Error fetching admin payments:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPayments = payments.filter(p => {
        const searchStr = searchTerm.toLowerCase();
        return p.product_name?.toLowerCase().includes(searchStr) ||
            p.product_id?.toLowerCase().includes(searchStr) ||
            p.customerDetails?.name?.toLowerCase().includes(searchStr);
    });

    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    return (
        <DashboardLayout role="admin" userName="Admin">
            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Revenue Management</h1>
                        <p className="text-gray-500 mt-1">BookyBee commission (10%) and completed transaction history.</p>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search service, customer, ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-gray-100 rounded-2xl pl-11 pr-4 py-3 min-w-75 focus:outline-none focus:border-purple-200 outline-hidden shadow-sm transition-all text-sm w-full md:w-auto"
                        />
                    </div>
                </div>

                {/* Revenue Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-purple-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-20">
                            <CreditCard className="w-32 h-32" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-purple-200 font-bold uppercase tracking-wider mb-2 text-sm">Gross Volume (10% Commission)</p>
                            <h2 className="text-5xl font-black text-white tracking-tight">
                                Rs {(totalRevenue * 0.1).toLocaleString()}
                            </h2>
                            <p className="text-purple-100 mt-4 font-medium flex items-center">
                                Estimated platform revenue from {payments.length} verified transactions totaling Rs {totalRevenue.toLocaleString()}.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Payments List */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 md:p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        Completed Transactions <span className="ml-3 px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-black uppercase tracking-wider">{filteredPayments.length} Total</span>
                    </h3>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex flex-col items-center py-20">
                                <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-4" />
                                <p className="text-gray-400 font-medium">Fetching payment ledgers...</p>
                            </div>
                        ) : filteredPayments.length > 0 ? (
                            filteredPayments.map((payment) => (
                                <div key={payment._id} className="p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:border-purple-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                                    <div className="flex items-center space-x-5">
                                        <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-600 flex items-center justify-center transition-colors">
                                            <CreditCard className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">{payment.product_name}</h4>
                                            <p className="text-gray-500 font-medium flex items-center mt-1 text-sm">
                                                Customer: {payment.customerDetails?.name} • Contact: {payment.customerDetails?.phone}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap md:flex-nowrap items-center md:space-x-8 gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                                        <div>
                                            <div className="flex items-center text-sm font-bold text-gray-600 mb-1">
                                                <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                                                {new Date(payment.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center text-xs font-bold text-gray-400">
                                                <Hash className="w-3.5 h-3.5 mr-1" />
                                                {payment.product_id}
                                            </div>
                                        </div>

                                        <div className="text-right ml-auto">
                                            <div className="text-2xl font-black text-purple-600">
                                                Rs {payment.amount?.toLocaleString()}
                                            </div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-green-600 mt-1 inline-block px-2 py-0.5 rounded-sm bg-green-50 border border-green-100">
                                                COMPLETED via {payment.payment_gateway}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h4 className="text-lg font-bold text-gray-900 mb-1">No completed payments found</h4>
                                <p className="text-gray-500 max-w-sm mx-auto">Verified transactions will securely appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminPayments;
