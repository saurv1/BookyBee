import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API } from '../http';

const RegistrationVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!email) {
        navigate('/register');
        return null;
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await API.post('/auth/verify-otp', {
                email: email,
                otp: otp
            });
            if (response.status === 200) {
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12 px-4 flex items-center justify-center">
            <div className="w-full max-w-sm">
                <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
                    <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-[#FFB800]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                        </svg>
                    </div>

                    <h3 className="text-2xl font-bold text-[#1e293b] mb-2">Verify Email</h3>
                    <p className="text-gray-500 mb-6 text-sm">
                        Registration OTP has been sent to <br />
                        <span className="font-semibold text-gray-700">{email}</span>
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <input
                            type="text"
                            maxLength="4"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                            className="w-full px-4 py-4 text-center text-2xl font-bold tracking-[1em] placeholder:text-sm placeholder:tracking-normal placeholder:font-normal border border-gray-200 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-[#FFB800] text-white font-bold py-4 rounded-2xl hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Verifying...' : 'Verify & Register'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Change Email Address
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistrationVerification;
