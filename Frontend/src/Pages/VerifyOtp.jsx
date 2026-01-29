import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { API } from '../http';

const VerifyOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await API.post('/auth/verify-otp', { email, otp });
            if (response.status === 200) {
                navigate('/reset-password', { state: { email } });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-32 pb-12 px-4">
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-[#FFB800] rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-[#1e293b]">Verify OTP</h1>
                    </div>
                    <p className="text-gray-500">Enter the 4-digit code sent to<br /><span className="font-semibold text-gray-700">{email}</span></p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl text-center font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-[#1e293b] mb-2 text-center">Verification Code</label>
                            <input
                                type="text"
                                maxLength="4"
                                placeholder="0000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all text-center text-2xl tracking-[1em] font-bold"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#FFB800] text-white font-bold py-4 rounded-xl hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-200 hover:shadow-xl disabled:opacity-70"
                        >
                            {loading ? 'Verifying...' : 'Verify Code'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/forgot-password')}
                            className="w-full text-center text-sm text-gray-500 hover:text-gray-700 font-medium"
                        >
                            ← Use a different email
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
