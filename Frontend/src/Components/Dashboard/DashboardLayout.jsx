import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Search, Bell, X, Check } from 'lucide-react';
import { APIAuthenticated } from '../../http';

const DashboardLayout = ({ children, role, userName }) => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showToast, setShowToast] = useState(null);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await APIAuthenticated.get('/notification/get');
            if (res.data.success) {
                // Check for new notifications to show toast
                if (notifications.length > 0 && res.data.data.length > 0) {
                    const newNotify = res.data.data[0];
                    if (newNotify._id !== notifications[0]._id && !newNotify.isRead) {
                        setShowToast(newNotify);
                        setTimeout(() => setShowToast(null), 5000);
                    }
                }
                setNotifications(res.data.data);
                setUnreadCount(res.data.unreadCount);
            }
        } catch (err) {
            console.error("Error fetching notifications:", err);
        }
    };

    const handleMarkAsRead = async (notify) => {
        try {
            if (!notify.isRead) {
                await APIAuthenticated.put(`/notification/read/${notify._id}`);
                fetchNotifications();
            }

            // Navigate based on type
            if (notify.type === 'booking') {
                const path = role === 'provider' ? '/provider/bookings' : '/customer/bookings';
                navigate(path);
            } else if (notify.type === 'chat') {
                const path = role === 'provider' ? '/provider/messages' : '/customer/messages';
                navigate(path);
            }

            setShowNotifications(false);
        } catch (err) {
            console.error("Error marking read:", err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await APIAuthenticated.put('/notification/read-all');
            fetchNotifications();
        } catch (err) {
            console.error("Error marking all read:", err);
        }
    };

    const hasUnreadMessages = notifications.some(n => !n.isRead && n.type === 'chat');

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Sidebar role={role} userName={userName} hasUnreadMessages={hasUnreadMessages} />

            <div className="pl-64 flex flex-col min-h-screen">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex-1 max-w-xl">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-yellow-200 focus:outline-none transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors group"
                            >
                                <Bell className="w-5 h-5 group-hover:text-gray-600" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[10px] text-white flex items-center justify-center font-bold">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                    <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                                        <h4 className="font-bold text-gray-900">Notifications</h4>
                                        <button
                                            onClick={handleMarkAllAsRead}
                                            className="text-xs text-yellow-500 font-bold hover:underline"
                                        >
                                            Mark all read
                                        </button>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((notify) => (
                                                <div
                                                    key={notify._id}
                                                    onClick={() => handleMarkAsRead(notify)}
                                                    className={`p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors ${!notify.isRead ? 'bg-red-50/10' : ''}`}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-sm font-bold text-gray-900">{notify.title}</p>
                                                        {!notify.isRead && <span className="w-2.5 h-2.5 bg-red-500 rounded-full mt-1.5 shadow-sm"></span>}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{notify.message}</p>
                                                    <p className="text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wider">{new Date(notify.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-10 text-center flex flex-col items-center space-y-2">
                                                <Bell className="w-10 h-10 text-gray-200" />
                                                <p className="text-sm text-gray-400 font-medium">No notifications yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Toast Notification Popup */}
                {showToast && (
                    <div className="fixed top-20 right-8 bg-white rounded-2xl shadow-2xl border-l-4 border-yellow-400 p-6 z-[100] animate-slide-in-right flex items-start space-x-4 max-w-sm">
                        <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                            <Bell className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div className="flex-1">
                            <h5 className="font-bold text-gray-900">{showToast.title}</h5>
                            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{showToast.message}</p>
                        </div>
                        <button onClick={() => setShowToast(null)} className="p-1 hover:bg-gray-50 rounded-lg">
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                )}

                {/* Page Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
