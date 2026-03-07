import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../Components/Dashboard/DashboardLayout';
import { MessageSquare, Search, ChevronRight, User, Loader2 } from 'lucide-react';
import { APIAuthenticated } from '../http';

const ChatList = ({ role }) => {
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    useEffect(() => {
        fetchChatList();
        markMessagesAsRead();
    }, []);

    const markMessagesAsRead = async () => {
        try {
            await APIAuthenticated.put('/notification/read-type/chat');
        } catch (err) {
            console.error("Error clearing chat notifications:", err);
        }
    };

    const fetchChatList = async () => {
        try {
            setLoading(false); // Optimization: set early if we want to show empty state fast
            const res = await APIAuthenticated.get('/message/list');
            if (res.data.success) {
                setChats(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching chat list:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredChats = chats.filter(chat =>
        `${chat.firstName} ${chat.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role={role} userName={user?.firstName || 'User'}>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
                    <p className="text-gray-500 mt-1">Manage your active conversations with {role === 'customer' ? 'providers' : 'customers'}.</p>
                </div>

                <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-50 bg-white">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search messages or people..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-yellow-200 focus:outline-none transition-all font-medium text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex-1">
                        {loading ? (
                            <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
                                <Loader2 className="w-10 h-10 text-[#FFB800] animate-spin" />
                                <p className="text-gray-400 font-medium">Loading conversations...</p>
                            </div>
                        ) : filteredChats.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {filteredChats.map((chat) => (
                                    <div
                                        key={chat._id}
                                        onClick={() => navigate(`/chat/${chat._id}`)}
                                        className="p-6 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-all group"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-14 h-14 rounded-2xl bg-yellow-50 flex items-center justify-center font-bold text-[#FFB800] text-xl group-hover:scale-105 transition-transform shadow-sm">
                                                {chat.firstName.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{chat.firstName} {chat.lastName}</h3>
                                                <p className="text-sm text-gray-500 line-clamp-1 truncate max-w-50 md:max-w-md italic opacity-80">
                                                    {chat.lastMessage}
                                                </p>
                                                <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">
                                                    {new Date(chat.timestamp).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-20 flex flex-col items-center justify-center text-center space-y-6">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                                    <MessageSquare className="w-10 h-10 text-gray-300" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900">No messages yet</h4>
                                    <p className="text-gray-500 max-w-xs mx-auto text-sm mt-1">Start chatting with experts and providers to see your message history here.</p>
                                </div>
                                <button
                                    onClick={() => navigate(role === 'customer' ? '/services' : '/service-provider')}
                                    className="bg-[#111827] text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-100"
                                >
                                    Explore Providers
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ChatList;
