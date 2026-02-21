import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { APIAuthenticated, API } from '../http';
import { Send, ArrowLeft, Loader2, User, Phone, Mail } from 'lucide-react';
import Navbar from './Navbar';

const Chat = () => {
    const { receiverId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [receiver, setReceiver] = useState(null);
    const messagesEndRef = useRef(null);
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')));

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        fetchReceiverDetails();
        fetchMessages();

        // Polling for new messages every 3 seconds
        const interval = setInterval(fetchMessages, 3000);

        // Clear chat notifications
        markMessagesAsRead();

        return () => clearInterval(interval);
    }, [receiverId]);

    const markMessagesAsRead = async () => {
        try {
            await APIAuthenticated.put('/notification/read-type/chat');
        } catch (err) {
            console.error("Error clearing chat notifications:", err);
        }
    };

    useEffect(scrollToBottom, [messages]);

    const fetchReceiverDetails = async () => {
        try {
            // Need a way to get user details by ID
            const res = await APIAuthenticated.get(`/auth/user/${receiverId}`);
            if (res.data.success) {
                setReceiver(res.data.user);
            }
        } catch (err) {
            console.error("Error fetching receiver details:", err);
        }
    };

    const fetchMessages = async () => {
        try {
            const res = await APIAuthenticated.get(`/message/get/${receiverId}`);
            if (res.data.success) {
                setMessages(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching messages:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            setSending(true);
            const res = await APIAuthenticated.post('/message/send', {
                receiverId,
                message: newMessage
            });
            if (res.data.success) {
                setMessages([...messages, res.data.data]);
                setNewMessage('');
            }
        } catch (err) {
            console.error("Error sending message:", err);
        } finally {
            setSending(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="w-12 h-12 text-[#FFB800] animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-1 pt-24 pb-6 px-6 max-w-5xl mx-auto w-full flex flex-col">
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
                        <div className="flex items-center space-x-4">
                            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                                <ArrowLeft className="w-5 h-5 text-gray-500" />
                            </button>
                            <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center font-bold text-[#FFB800] text-xl">
                                {receiver?.firstName?.charAt(0) || <User className="w-6 h-6" />}
                            </div>
                            <div>
                                <h2 className="font-bold text-gray-900 leading-tight">
                                    {receiver ? `${receiver.firstName} ${receiver.lastName}` : 'Chat'}
                                </h2>
                                <p className="text-xs text-green-500 font-bold flex items-center">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                                    Online
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-xs font-medium text-gray-400">
                                <Phone className="w-3.5 h-3.5" />
                                <span>{receiver?.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs font-medium text-gray-400">
                                <Mail className="w-3.5 h-3.5" />
                                <span>{receiver?.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                                <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center">
                                    <Send className="w-10 h-10 text-[#FFB800]" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Start a Conversation</p>
                                    <p className="text-sm">Send a message to start chatting with {receiver?.firstName}.</p>
                                </div>
                            </div>
                        ) : (
                            messages.map((msg, idx) => (
                                <div
                                    key={msg._id || idx}
                                    className={`flex ${msg.sender === currentUser._id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] p-4 rounded-3xl text-sm font-medium shadow-sm ${msg.sender === currentUser._id
                                        ? 'bg-[#FFB800] text-white rounded-br-none'
                                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                                        }`}>
                                        <p>{msg.message}</p>
                                        <p className={`text-[10px] mt-1.5 ${msg.sender === currentUser._id ? 'text-white/70' : 'text-gray-400'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-white border-t border-gray-50">
                        <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 bg-gray-50 border border-transparent rounded-2xl px-6 py-4 focus:bg-white focus:border-yellow-200 focus:outline-none transition-all font-medium text-sm"
                            />
                            <button
                                type="submit"
                                disabled={sending || !newMessage.trim()}
                                className="w-14 h-14 bg-[#FFB800] text-white rounded-2xl flex items-center justify-center hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-100 disabled:opacity-50"
                            >
                                {sending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
