import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  const allServices = [
    {
      name: 'House Cleaning', desc: 'Professional cleaning for every corner of your home, including deep cleaning and regular maintenance.', price: 'From Rs 350/hr', color: 'bg-blue-50', iconColor: 'text-blue-500', iconBg: 'bg-blue-100',
      icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 12h3v9h6v-6h4v6h6v-9h3L12 2z" /></svg>
    },
    {
      name: 'Home Repairs', desc: 'General handymen services for fixing furniture, leaking faucets, or any household structure.', price: 'From Rs 500/hr', color: 'bg-green-50', iconColor: 'text-green-500', iconBg: 'bg-green-100',
      icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.5 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" /></svg>
    },
    {
      name: 'Painting', desc: 'Fresh coat of paint for your interior walls or external facade with high-quality finishes.', price: 'From Rs 450/hr', color: 'bg-purple-50', iconColor: 'text-purple-500', iconBg: 'bg-purple-100',
      icon: <span className="text-3xl">🎨</span>
    },
    {
      name: 'Electrical', desc: 'Expert troubleshooting, wiring, and appliance installation by certified electricians.', price: 'From Rs 500/hr', color: 'bg-orange-50', iconColor: 'text-orange-500', iconBg: 'bg-orange-100',
      icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2h10l-3.5 10H19L7 22l3.5-10H5L7 2z" /></svg>
    },
    {
      name: 'Plumbing', desc: 'Leak detection, pipe repairs, and new fixture installations for your kitchen and bathroom.', price: 'From Rs 400/hr', color: 'bg-red-50', iconColor: 'text-red-500', iconBg: 'bg-red-100',
      icon: <span className="text-3xl">💧</span>
    },
    {
      name: 'Gardening', desc: 'Complete lawn care, landscaping, and regular plant maintenance for your outdoor spaces.', price: 'From Rs 350/hr', color: 'bg-emerald-50', iconColor: 'text-emerald-500', iconBg: 'bg-emerald-100',
      icon: <span className="text-3xl">🌿</span>
    },
    {
      name: 'AC Repair', desc: 'Comprehensive air conditioning servicing, gas refills, and cooling optimizations.', price: 'From Rs 450/hr', color: 'bg-indigo-50', iconColor: 'text-indigo-500', iconBg: 'bg-indigo-100',
      icon: <span className="text-3xl">❄</span>
    },
    {
      name: 'Moving Help', desc: 'Stress-free relocation assistance including careful packing, loading, and safe transport.', price: 'From Rs 400/hr', color: 'bg-pink-50', iconColor: 'text-pink-500', iconBg: 'bg-pink-100',
      icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM18 9.5l2.04 3H17V9.5h1z" /></svg>
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-extrabold text-[#1e293b]">Our Services</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Choose from a wide range of top-rated home services tailored to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {allServices.map((service, idx) => (
            <div key={idx} className={`${service.color} p-10 rounded-[40px] border border-transparent hover:border-white hover:shadow-2xl transition-all duration-300 group relative overflow-hidden`}>
              <div className={`w-16 h-16 ${service.iconBg} ${service.iconColor} rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.name}</h3>
              <p className="text-gray-600 mb-8 leading-relaxed text-sm">
                {service.desc}
              </p>
              <div className="flex items-center justify-between">
                <span className={`font-bold ${service.iconColor}`}>{service.price}</span>
                <Link to="/register" className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-sm text-gray-700 hover:text-[#FFB800] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-[#FFB800] rounded-[48px] p-12 text-center text-white shadow-2xl shadow-yellow-200">
          <h2 className="text-4xl font-black mb-6">Need a custom service?</h2>
          <p className="text-white/90 text-xl mb-10 max-w-2xl mx-auto">
            Can't find what you're looking for? Contact us and we'll help you find the right expert for your unique needs.
          </p>
          <Link to="/contact" className="bg-white text-[#FFB800] px-10 py-5 rounded-2xl font-black text-xl hover:bg-gray-50 transition-all shadow-xl inline-block">
            Contact Us Today
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;
