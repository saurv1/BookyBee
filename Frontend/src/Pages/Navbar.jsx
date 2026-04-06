import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const isDashboardActive = ['/admin-dashboard', '/service-provider', '/customer-dashboard'].includes(location.pathname);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLogged(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    setIsLogged(false);
    navigate('/');
    setIsOpen(false);
  };

  const handleDashboardClick = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (user?.role === 'provider') {
        navigate('/service-provider');
      } else {
        navigate('/customer-dashboard');
      }
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-100">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L1 12h3v9h6v-6h4v6h6v-9h3L12 2z" />
              </svg>
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">BookyBee</span>
          </Link>

          {/* Middle: Links (Desktop) */}
          <div className="hidden md:flex space-x-8 text-gray-600 font-bold text-sm">
            <Link to="/" className={`transition-colors ${isActive('/') ? 'text-yellow-600' : 'hover:text-yellow-600'}`}>Home</Link>
            <Link to="/services" className={`transition-colors ${isActive('/services') ? 'text-yellow-600' : 'hover:text-yellow-600'}`}>Services</Link>
            <Link to="/how-it-works" className={`transition-colors ${isActive('/how-it-works') ? 'text-yellow-600' : 'hover:text-yellow-600'}`}>How It Works</Link>
            <Link to="/contact" className={`transition-colors ${isActive('/contact') ? 'text-yellow-600' : 'hover:text-yellow-600'}`}>Contact</Link>
            <button onClick={handleDashboardClick} className={`transition-colors ${isDashboardActive ? 'text-yellow-600' : 'hover:text-yellow-600'}`}>Dashboard</button>
          </div>

          {/* Right: Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            {isLogged ? (
              <div className="flex items-center space-x-6">
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-gray-900 font-bold text-sm transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-red-600 transition-all shadow-xl shadow-red-100 active:scale-95"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-gray-900 font-bold text-sm transition-colors">Login</Link>
                <Link
                  to="/register"
                  className="bg-[#FFB800] text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-yellow-500 transition-all shadow-xl shadow-yellow-100 active:scale-95"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu (Mobile Only) */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white shadow-2xl transition-all duration-300 ease-in-out border-t border-gray-50 origin-top ${isOpen ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-95 invisible'}`}>
        <div className="px-6 py-10 flex flex-col space-y-6">
          <Link to="/" className={`text-xl font-bold ${isActive('/') ? 'text-yellow-600' : 'text-gray-900'}`} onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/services" className={`text-xl font-bold ${isActive('/services') ? 'text-yellow-600' : 'text-gray-900'}`} onClick={() => setIsOpen(false)}>Services</Link>
          <Link to="/how-it-works" className={`text-xl font-bold ${isActive('/how-it-works') ? 'text-yellow-600' : 'text-gray-900'}`} onClick={() => setIsOpen(false)}>How It Works</Link>
          <Link to="/contact" className={`text-xl font-bold ${isActive('/contact') ? 'text-yellow-600' : 'text-gray-900'}`} onClick={() => setIsOpen(false)}>Contact</Link>
          <button onClick={handleDashboardClick} className={`text-xl font-bold text-left ${isDashboardActive ? 'text-yellow-600' : 'text-gray-900'}`}>Dashboard</button>
          
          <div className="pt-8 border-t border-gray-50 flex flex-col space-y-4">
            {isLogged ? (
              <>
                <Link to="/profile" className="text-xl font-bold text-gray-900" onClick={() => setIsOpen(false)}>Profile</Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white w-full text-center py-4 rounded-2xl font-black text-lg shadow-xl shadow-red-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-xl font-bold text-gray-900 text-center" onClick={() => setIsOpen(false)}>Login</Link>
                <Link
                  to="/register"
                  className="bg-[#FFB800] text-white w-full text-center py-4 rounded-2xl font-black text-lg shadow-xl shadow-yellow-100"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
