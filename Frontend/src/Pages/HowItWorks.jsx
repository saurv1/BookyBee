import React from 'react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
    const steps = [
        {
            id: 1,
            title: 'Search & Select',
            desc: 'Browse through our extensive list of services and filters. Look at service provider profiles, prices, and past customer ratings to find the perfect match for your job.',
            icon: '🔍',
            details: ['Filter by Category', 'Compare Prices', 'Check verified ratings']
        },
        {
            id: 2,
            title: 'Chat & Book',
            desc: 'Contact providers directly through our platform. Discuss your specific requirements, get instant quotes, and schedule a convenient time slot that fits your busy life.',
            icon: '💬',
            details: ['Direct messaging', 'Instant confirmations', 'Flexible scheduling']
        },
        {
            id: 3,
            title: 'Pay & Rate',
            desc: 'After the service is completed to your satisfaction, pay securely through the platform. Don\'t forget to leave a review to help other community members!',
            icon: '⭐',
            details: ['Secure payments', 'Rating system', 'Service history']
        }
    ];

    return (
        <div className="min-h-screen bg-white pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 space-y-4">
                    <h1 className="text-5xl font-black text-[#1e293b]">How It Works</h1>
                    <p className="text-gray-500 text-xl max-w-2xl mx-auto">
                        BookyBee makes finding reliable help as easy as 1-2-3.
                    </p>
                </div>

                <div className="space-y-32">
                    {steps.map((step, idx) => (
                        <div key={step.id} className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16`}>
                            <div className="flex-1">
                                <div className="w-24 h-24 bg-[#FFB800] text-white rounded-3xl flex items-center justify-center text-4xl font-black shadow-2xl shadow-yellow-200 mb-8 transform hover:rotate-6 transition-transform">
                                    {step.id}
                                </div>
                                <h2 className="text-4xl font-extrabold text-[#111827] mb-6">{step.title}</h2>
                                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                    {step.desc}
                                </p>
                                <ul className="space-y-4">
                                    {step.details.map((detail, i) => (
                                        <li key={i} className="flex items-center space-x-3 text-gray-700 font-semibold">
                                            <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm">✓</span>
                                            <span>{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-[64px] p-12 aspect-square flex items-center justify-center text-9xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                <span className="group-hover:scale-110 transition-transform duration-500">{step.icon}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-32 text-center p-16 bg-[#111827] rounded-[64px] text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <h2 className="text-4xl font-black mb-8">Ready to get started?</h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link to="/register" className="w-full sm:w-auto bg-[#FFB800] text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-yellow-500 transition-all shadow-xl shadow-yellow-900/20">
                            Join as Customer
                        </Link>
                        <Link to="/register?role=provider" className="w-full sm:w-auto border-2 border-white/20 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-white/10 transition-all">
                            Become a Provider
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
