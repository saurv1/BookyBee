import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Users,
    Settings,
    Star,
    CreditCard,
    BarChart3,
    Briefcase,
    Wrench,
    Clock,
    MessageSquare,
    Heart,
    LogOut,
    ChevronRight,
    AlertCircle
} from 'lucide-react';

const Sidebar = ({ role, userName, hasUnreadMessages, profilePicture }) => {
    const location = useLocation();

    const adminLinks = [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/admin-dashboard' },
        { title: 'Bookings', icon: Calendar, path: '/admin/bookings' },
        { title: 'Users', icon: Users, path: '/admin/users' },
        { title: 'Service Providers', icon: Briefcase, path: '/admin/providers' },
        { title: 'Services', icon: Wrench, path: '/admin/services' },
        { title: 'Payments', icon: CreditCard, path: '/admin/payments' },
        { title: 'Reviews', icon: Star, path: '/admin/reviews' },
        { title: 'Complaints', icon: AlertCircle, path: '/admin/complaints' },
        { title: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
        { title: 'Profile', icon: Users, path: '/profile' },
    ];

    const providerLinks = [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/service-provider' },
        { title: 'Bookings', icon: Calendar, path: '/provider/bookings' },
        { title: 'My Services', icon: Wrench, path: '/provider/services' },
        { title: 'Reviews', icon: Star, path: '/provider/reviews' },
        { title: 'Earnings', icon: BarChart3, path: '/provider/earnings' },
        { title: 'Schedule', icon: Clock, path: '/provider/schedule' },
        { title: 'Messages', icon: MessageSquare, path: '/provider/messages' },
        { title: 'Complaints', icon: AlertCircle, path: '/provider/complaints' },
        { title: 'Profile', icon: Users, path: '/profile' },
    ];

    const customerLinks = [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/customer-dashboard' },
        { title: 'My Bookings', icon: Calendar, path: '/customer/bookings' },
        { title: 'Services', icon: Wrench, path: '/services' },
        { title: 'Favorites', icon: Heart, path: '/customer/favorites' },
        { title: 'Payments', icon: CreditCard, path: '/customer/payments' },
        { title: 'Messages', icon: MessageSquare, path: '/customer/messages' },
        { title: 'Complaints', icon: AlertCircle, path: '/customer/complaints' },
        { title: 'Profile', icon: Users, path: '/profile' },
    ];

    const links = role === 'admin' ? adminLinks : role === 'provider' ? providerLinks : customerLinks;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    return (
        <div className="h-screen w-64 bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-50">
            {/* Logo */}
            <div className="p-6 border-b border-gray-50">
                <Link to="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-[#FFB800] rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L1 12h3v9h6v-6h4v6h6v-9h3L12 2z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-gray-800">BookyBee</span>
                </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.title}
                            to={link.path}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-yellow-50 text-yellow-600 font-semibold'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                }`}
                        >
                            <div className="flex items-center space-x-3 text-sm">
                                <link.icon className={`w-5 h-5 ${isActive ? 'text-yellow-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                <span className="text-[15px]">{link.title}</span>
                            </div>
                            {link.title === 'Messages' && hasUnreadMessages && (
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-sm animate-pulse" />
                            )}
                            {isActive && link.title !== 'Messages' && (
                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-gray-50 mt-auto bg-gray-50/30">
                <Link to="/profile" className="flex items-center space-x-3 mb-4 p-2 hover:bg-gray-100/50 rounded-xl transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold uppercase transition-all group-hover:scale-105 border border-white shadow-sm overflow-hidden">
                        {profilePicture ? (
                            <img src={`http://localhost:3005/uploads/${profilePicture}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                            userName?.charAt(0) || 'U'
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
                        <p className="text-xs text-gray-400 capitalize truncate">{role}</p>
                    </div>
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 font-medium transition-all duration-200"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
