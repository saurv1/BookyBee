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
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 px-6 py-4 flex items-center justify-between border-b border-gray-100">
      {/* Left: Logo */}
      <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L1 12h3v9h6v-6h4v6h6v-9h3L12 2z" />
          </svg>
        </div>
        <span className="text-xl font-bold text-gray-800">BookyBee</span>
      </Link>

      {/* Middle: Links */}
      <div className="hidden md:flex space-x-8 text-gray-600 font-medium">
        <Link to="/" className={`transition-colors ${isActive('/') ? 'text-yellow-600' : 'hover:text-yellow-600'}`}>Home</Link>
        <Link to="/services" className={`transition-colors ${isActive('/services') ? 'text-yellow-600' : 'hover:text-yellow-600'}`}>Services</Link>
        <Link to="/how-it-works" className={`transition-colors ${isActive('/how-it-works') ? 'text-yellow-600' : 'hover:text-yellow-600'}`}>How It Works</Link>
        <Link to="/contact" className={`transition-colors ${isActive('/contact') ? 'text-yellow-600' : 'hover:text-yellow-600'}`}>Contact</Link>
        <button onClick={handleDashboardClick} className={`transition-colors ${isDashboardActive ? 'text-yellow-600' : 'hover:text-yellow-600'}`}>Dashboard</button>
      </div>

      {/* Right: Auth Buttons */}
      <div className="hidden md:flex items-center space-x-6">
        {isLogged ? (
          <div className="flex items-center space-x-4">
            <Link
              to="/profile"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-600 transition-all shadow-lg shadow-red-100"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Login</Link>
            <Link
              to="/register"
              className="bg-[#FFB800] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-200"
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
          className="text-gray-700 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-white shadow-xl flex flex-col items-center md:hidden py-8 space-y-4 border-t border-gray-50">
          <Link to="/" className={`font-medium ${isActive('/') ? 'text-yellow-600' : 'text-gray-700 hover:text-yellow-600'}`} onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/services" className={`font-medium ${isActive('/services') ? 'text-yellow-600' : 'text-gray-700 hover:text-yellow-600'}`} onClick={() => setIsOpen(false)}>Services</Link>
          <Link to="/how-it-works" className={`font-medium ${isActive('/how-it-works') ? 'text-yellow-600' : 'text-gray-700 hover:text-yellow-600'}`} onClick={() => setIsOpen(false)}>How It Works</Link>
          <Link to="/contact" className={`font-medium ${isActive('/contact') ? 'text-yellow-600' : 'text-gray-700 hover:text-yellow-600'}`} onClick={() => setIsOpen(false)}>Contact</Link>
          <button onClick={handleDashboardClick} className={`font-medium ${isDashboardActive ? 'text-yellow-600' : 'text-gray-700 hover:text-yellow-600'}`}>Dashboard</button>
          <div className="pt-4 flex flex-col items-center space-y-4 w-full px-10">
            {isLogged ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white w-full text-center px-6 py-3 rounded-xl font-semibold shadow-lg shadow-red-100"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 font-medium" onClick={() => setIsOpen(false)}>Login</Link>
                <Link
                  to="/register"
                  className="bg-[#FFB800] text-white w-full text-center px-6 py-3 rounded-xl font-semibold shadow-lg shadow-yellow-200"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
