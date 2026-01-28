import React from 'react';
import heroImage from '../assets/illustrations.png';

const Home = () => {
  const services = [
    {
      name: 'House Cleaning', desc: 'Professional cleaning services', price: 'From ₹ 350/hr', color: 'bg-blue-50', iconColor: 'text-blue-500', iconBg: 'bg-blue-100',
      icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 12h3v9h6v-6h4v6h6v-9h3L12 2z" /></svg>
    },
    {
      name: 'Home Repairs', desc: 'Fix anything in your home', price: 'From ₹ 500/hr', color: 'bg-green-50', iconColor: 'text-green-500', iconBg: 'bg-green-100',
      icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.5 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" /></svg>
    },
    {
      name: 'Painting', desc: 'Interior & exterior painting', price: 'From ₹ 450/hr', color: 'bg-purple-50', iconColor: 'text-purple-500', iconBg: 'bg-purple-100',
      icon: <span className="text-2xl">🎨</span>
    },
    {
      name: 'Electrical', desc: 'Licensed electricians', price: 'From ₹ 500/hr', color: 'bg-orange-50', iconColor: 'text-orange-500', iconBg: 'bg-orange-100',
      icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2h10l-3.5 10H19L7 22l3.5-10H5L7 2z" /></svg>
    },
    {
      name: 'Plumbing', desc: 'Expert plumbing services', price: 'From ₹ 400/hr', color: 'bg-red-50', iconColor: 'text-red-500', iconBg: 'bg-red-100',
      icon: <span className="text-2xl">💧</span>
    },
    {
      name: 'Gardening', desc: 'Lawn care & landscaping', price: 'From ₹ 350/hr', color: 'bg-emerald-50', iconColor: 'text-emerald-500', iconBg: 'bg-emerald-100',
      icon: <span className="text-2xl">🌿</span>
    },
    {
      name: 'AC Repair', desc: 'HVAC maintenance & repair', price: 'From ₹ 450/hr', color: 'bg-indigo-50', iconColor: 'text-indigo-500', iconBg: 'bg-indigo-100',
      icon: <span className="text-2xl">❄</span>
    },
    {
      name: 'Moving Help', desc: 'Packing & moving assistance', price: 'From ₹ 400/hr', color: 'bg-pink-50', iconColor: 'text-pink-500', iconBg: 'bg-pink-100',
      icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM18 9.5l2.04 3H17V9.5h1z" /></svg>
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="relative px-6 py-16 md:py-24 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center space-x-2 bg-green-50 px-4 py-1.5 rounded-full border border-green-100">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-semibold text-green-700">Trusted by 50,000+ customers</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
            Your Everyday <br />
            <span className="text-[#FFB800]">Chores Made</span> <br />
            Simple
          </h1>

          <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
            Book trusted service providers for all your household needs. From cleaning to repairs, find the perfect expert near you in minutes.
          </p>

          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="What service do you need?"
              className="w-full pl-12 pr-32 py-4 rounded-2xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
              🔍
            </div>
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#FFB800] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-yellow-500 transition-colors">
              Search
            </button>
          </div>

          <div className="flex items-center space-x-12 pt-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600 shadow-sm">🛡️</div>
              <div>
                <p className="font-bold text-gray-900 leading-tight">Verified Experts</p>
                <p className="text-xs text-gray-500">Background checked</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600 shadow-sm">⭐</div>
              <div>
                <p className="font-bold text-gray-900 leading-tight">Top Rated</p>
                <p className="text-xs text-gray-500">4.8+ average rating</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="absolute -top-10 -right-4 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center space-x-3 border border-gray-50 animate-bounce-slow">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-xl">👥</div>
            <div>
              <p className="font-bold text-gray-900 text-sm">5,000+</p>
              <p className="text-[10px] text-gray-500">Active Providers</p>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-8 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center space-x-3 border border-gray-50">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-xl text-green-600">✓</div>
            <div>
              <p className="font-bold text-gray-900 text-sm">2,500+</p>
              <p className="text-[10px] text-gray-500">Bookings Today</p>
            </div>
          </div>

          <div className="relative transform hover:scale-[1.05] transition-transform duration-700 ease-out">
            <img src={heroImage} alt="Home service illustrations" className="w-full h-auto" />

            {/* Playful background blobs */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-yellow-50/50 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="bg-gray-50 py-24 px-6" id="services">
        <div className="max-w-7xl mx-auto text-center space-y-4 mb-16">
          <h2 className="text-4xl font-extrabold text-[#111827]">Popular Services</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Everything you need for your home, all in one place</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <div key={idx} className={`${service.color} p-8 rounded-[32px] group hover:shadow-xl transition-all duration-300 cursor-pointer border border-transparent hover:border-white/50 relative overflow-hidden`}>
              <div className={`w-14 h-14 ${service.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform ${service.iconColor}`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{service.name}</h3>
              <p className="text-sm text-gray-500 mb-6 line-clamp-2 md:h-10">{service.desc}</p>
              <p className={`font-bold ${service.iconColor} text-sm transition-all group-hover:translate-x-1`}>
                {service.price}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="px-10 py-4 rounded-xl border-2 border-yellow-400 text-yellow-600 font-bold hover:bg-yellow-400 hover:text-white transition-all">
            View All Services
          </button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-white relative overflow-hidden" id="how-it-works">
        {/* Background Decorative Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-50/50 rounded-full blur-3xl -z-10"></div>

        <div className="text-center space-y-4 mb-20">
          <h2 className="text-4xl font-extrabold text-[#111827]">How BookyBee Works</h2>
          <p className="text-gray-500">Book your service in three simple steps</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line (hidden on mobile) */}
          <div className="hidden md:block absolute top-[100px] left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-yellow-200 -z-0"></div>

          {/* Step 1 */}
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 z-10 group">
            <div className="w-20 h-20 bg-[#FFB800] text-white rounded-[24px] flex items-center justify-center text-3xl font-black shadow-lg shadow-yellow-200 group-hover:rotate-6 transition-transform">1</div>
            <h3 className="text-2xl font-bold text-gray-900">Search & Select</h3>
            <p className="text-gray-500 leading-relaxed text-sm">Browse services, filter by price, rating and location. View detailed profiles of top-rated providers.</p>
            <div className="flex space-x-2 mt-4">
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-100"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-50"></div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 z-10 group">
            <div className="w-20 h-20 bg-[#FFB800] text-white rounded-[24px] flex items-center justify-center text-3xl font-black shadow-lg shadow-yellow-200 group-hover:-rotate-6 transition-transform">2</div>
            <h3 className="text-2xl font-bold text-gray-900">Chat & Book</h3>
            <p className="text-gray-500 leading-relaxed text-sm">Message providers directly, get instant quotes and book your preferred time slot with confirmation.</p>
            <div className="flex space-x-2 mt-4">
              <div className="w-2 h-2 rounded-full bg-yellow-100"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-100"></div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 z-10 group">
            <div className="w-20 h-20 bg-[#FFB800] text-white rounded-[24px] flex items-center justify-center text-3xl font-black shadow-lg shadow-yellow-200 group-hover:rotate-6 transition-transform">3</div>
            <h3 className="text-2xl font-bold text-gray-900">Pay & Rate</h3>
            <p className="text-gray-500 leading-relaxed text-sm">Secure payment options, rate your experience and help others find the best service providers.</p>
            <div className="flex space-x-2 mt-4">
              <div className="w-2 h-2 rounded-full bg-yellow-50"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-100"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Styles for the slow bounce */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
      `}</style>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white/60 text-sm">
            Copyright &copy; 2026 <span className="font-bold text-white">BookyBee</span>. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

