import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../Components/Dashboard/DashboardLayout';
import { User, Mail, Phone, MapPin, Briefcase, DollarSign, Save, Loader2, Lock, ShieldCheck, Camera, Trash2, Upload, X, Check } from 'lucide-react';
import { APIAuthenticated } from '../http';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        district: '',
        serviceCategory: '',
        price: ''
    });
    const [initialData, setInitialData] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showImageMenu, setShowImageMenu] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [removeFlag, setRemoveFlag] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    // Password state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            setUser(userData);
            const initial = {
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                phone: userData.phone || '',
                address: userData.address || '',
                district: userData.district || '',
                serviceCategory: userData.serviceCategory || '',
                price: userData.price || ''
            };
            setFormData(initial);
            setInitialData(initial);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setRemoveFlag(false);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setShowImageMenu(false);
        }
    };

    const startCamera = async () => {
        setShowCamera(true);
        setShowImageMenu(false);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setMessage({ type: 'error', text: 'Could not access camera' });
            setShowCamera(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
        setShowCamera(false);
    };

    const takePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
                setImageFile(file);
                setImagePreview(canvas.toDataURL('image/jpeg'));
                setRemoveFlag(false);
                stopCamera();
            }, 'image/jpeg');
        }
    };

    const handleRemovePhoto = () => {
        setImageFile(null);
        setImagePreview(null);
        setRemoveFlag(true);
        setShowImageMenu(false);
    };

    const isChanged = JSON.stringify(formData) !== JSON.stringify(initialData) || imageFile !== null || removeFlag;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isChanged || !user?._id) return;

        try {
            setLoading(true);
            setMessage({ type: '', text: '' });

            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            if (imageFile) {
                data.append('profilePicture', imageFile);
            } else if (removeFlag) {
                data.append('removeProfilePicture', 'true');
            }

            const res = await APIAuthenticated.put(`/auth/update-profile/${user._id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (res.data.success) {
                const updatedUser = res.data.data;
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                setInitialData(formData);
                setImageFile(null);
                setRemoveFlag(false);
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        try {
            setPasswordLoading(true);
            setPasswordMessage({ type: '', text: '' });
            const res = await APIAuthenticated.put(`/auth/change-password/${user._id}`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            if (res.data.success) {
                setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            setPasswordMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
        } finally {
            setPasswordLoading(false);
        }
    };
    if (!user) return null;

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                        <p className="text-gray-500">Manage your personal information and settings.</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="h-32 bg-linear-to-r from-yellow-400 to-yellow-500"></div>
                    <div className="px-8 pb-8">
                        <div className="relative -mt-16 mb-8">
                            <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-lg relative group">
                                <div className="w-full h-full rounded-2xl overflow-hidden relative">
                                    {removeFlag ? (
                                        <div className="w-full h-full bg-yellow-100 flex items-center justify-center text-4xl font-bold text-yellow-700 uppercase">
                                            {user.firstName.charAt(0)}
                                        </div>
                                    ) : imagePreview || user.profilePicture ? (
                                        <img
                                            src={imagePreview || `http://localhost:3005/uploads/${user.profilePicture}`}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-yellow-100 flex items-center justify-center text-4xl font-bold text-yellow-700 uppercase">
                                            {user.firstName.charAt(0)}
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => setShowImageMenu(!showImageMenu)}
                                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    >
                                        <Camera className="w-8 h-8 text-white" />
                                    </button>
                                </div>

                                {/* Image Options Menu */}
                                {showImageMenu && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowImageMenu(false)}
                                        ></div>
                                        <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <button
                                                type="button"
                                                onClick={startCamera}
                                                className="w-full px-4 py-2.5 text-left flex items-center space-x-3 hover:bg-gray-50 text-gray-700 transition-colors"
                                            >
                                                <Camera className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm font-medium">Take Photo</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current.click()}
                                                className="w-full px-4 py-2.5 text-left flex items-center space-x-3 hover:bg-gray-50 text-gray-700 transition-colors"
                                            >
                                                <Upload className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm font-medium">Upload from device</span>
                                            </button>
                                            {(user.profilePicture || imagePreview) && (
                                                <button
                                                    type="button"
                                                    onClick={handleRemovePhoto}
                                                    className="w-full px-4 py-2.5 text-left flex items-center space-x-3 hover:bg-red-50 text-red-600 transition-colors border-t border-gray-50 mt-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Remove photo</span>
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>

                        {/* Camera Modal */}
                        {showCamera && (
                            <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                                <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                                    <div className="p-6 flex items-center justify-between border-b border-gray-100">
                                        <h3 className="text-xl font-bold text-gray-800">Take Photo</h3>
                                        <button onClick={stopCamera} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                            <X className="w-5 h-5 text-gray-400" />
                                        </button>
                                    </div>
                                    <div className="relative aspect-square bg-gray-900">
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            className="w-full h-full object-cover scale-x-[-1]"
                                        />
                                        <canvas ref={canvasRef} className="hidden" />
                                    </div>
                                    <div className="p-6 flex justify-center">
                                        <button
                                            type="button"
                                            onClick={takePhoto}
                                            className="w-16 h-16 rounded-full bg-yellow-400 border-4 border-yellow-100 shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                                        >
                                            <div className="w-8 h-8 rounded-full border-2 border-white"></div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {message.text && (
                            <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">First Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-yellow-200 focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Last Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-yellow-200 focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Email (Read-only)</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            value={user.email}
                                            readOnly
                                            className="w-full pl-11 pr-4 py-3 bg-gray-100 border border-transparent rounded-2xl text-gray-500 cursor-not-allowed outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-yellow-200 focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">District</label>
                                <div className="relative">
                                    <input
                                        list="profile-districts-list"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        placeholder="Type or select a district"
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-yellow-200 focus:outline-none transition-all"
                                    />
                                    <datalist id="profile-districts-list">
                                        {[
                                            "Achham", "Arghakhanchi", "Baglung", "Baitadi", "Bajhang", "Bajura", "Banke", "Bara", "Bardiya", "Bhaktapur",
                                            "Bhojpur", "Chitwan", "Dadeldhura", "Dailekh", "Dang", "Darchula", "Dhading", "Dhankuta", "Dhanusa", "Dolakha",
                                            "Dolpa", "Doti", "Eastern Rukum", "Gorkha", "Gulmi", "Humla", "Ilam", "Jajarkot", "Jhapa", "Jumla",
                                            "Kailali", "Kalikot", "Kanchanpur", "Kapilvastu", "Kaski", "Kathmandu", "Kavrepalanchok", "Khotang", "Lalitpur", "Lamjung",
                                            "Mahottari", "Makwanpur", "Manang", "Morang", "Mugu", "Mustang", "Myagdi", "Nawalpur", "Nuwakot", "Okhaldhunga",
                                            "Palpa", "Panchthar", "Parasi", "Parbat", "Parsa", "Pyuthan", "Ramechhap", "Rasuwa", "Rautahat", "Rolpa",
                                            "Rupandehi", "Salyan", "Sankhuwasabha", "Saptari", "Sarlahi", "Sindhuli", "Sindhupalchok", "Siraha", "Solukhumbu", "Sunsari",
                                            "Surkhet", "Syangja", "Tanahun", "Taplejung", "Terhathum", "Udayapur", "Western Rukum"
                                        ].map((district) => (
                                            <option key={district} value={district} />
                                        ))}
                                    </datalist>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-yellow-200 focus:outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {user.role === 'provider' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 ml-1">Service Category</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                name="serviceCategory"
                                                value={formData.serviceCategory}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-yellow-200 focus:outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 ml-1">Price per Hour (Rs)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-yellow-200 focus:outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={!isChanged || loading}
                                    className={`w-full flex items-center justify-center space-x-2 py-4 rounded-2xl font-bold transition-all shadow-lg ${!isChanged || loading
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                        : 'bg-[#FFB800] text-white hover:bg-yellow-500 shadow-yellow-100'
                                        }`}
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Save className="w-5 h-5" />
                                    )}
                                    <span>Save Changes</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Password Change Section */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mt-8">
                    <div className="p-8">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Security</h2>
                                <p className="text-sm text-gray-400 font-medium">Update your password to keep your account secure.</p>
                            </div>
                        </div>

                        {passwordMessage.text && (
                            <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${passwordMessage.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                                }`}>
                                {passwordMessage.text}
                            </div>
                        )}

                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Current Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            placeholder="••••••••"
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-purple-200 focus:outline-none transition-all placeholder:text-gray-300"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            placeholder="••••••••"
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-purple-200 focus:outline-none transition-all placeholder:text-gray-300"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Confirm New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            placeholder="••••••••"
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-purple-200 focus:outline-none transition-all placeholder:text-gray-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={passwordLoading || !passwordData.currentPassword || !passwordData.newPassword}
                                    className={`px-8 py-3 rounded-2xl font-bold transition-all shadow-lg flex items-center space-x-2 ${passwordLoading || !passwordData.currentPassword || !passwordData.newPassword
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                                        }`}
                                >
                                    {passwordLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <ShieldCheck className="w-5 h-5" />
                                    )}
                                    <span>Update Password</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
