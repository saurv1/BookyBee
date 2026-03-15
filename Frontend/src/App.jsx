import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Navbar from './Pages/Navbar';
import CustomerDashboard from './Pages/CustomerDashboard';
import ProviderDashboard from './Pages/ProviderDashboard';
import AdminDashboard from './Pages/AdminDashboard';
import ForgotPassword from './Pages/ForgotPassword';
import VerifyOtp from './Pages/VerifyOtp';
import ResetPassword from './Pages/ResetPassword';
import Services from './Pages/Services';
import HowItWorks from './Pages/HowItWorks';
import Contact from './Pages/Contact';
import BookingHistory from './Pages/BookingHistory';
import BookingConfirmation from './Pages/BookingConfirmation';
import CategoryProviders from './Pages/CategoryProviders';
import AdminUsers from './Pages/Admin/AdminUsers';
import AdminProviders from './Pages/Admin/AdminProviders';
import AdminBookings from './Pages/Admin/AdminBookings';
import AdminPayments from './Pages/Admin/AdminPayments';
import AdminReviews from './Pages/Admin/AdminReviews';
import AdminComplaints from './Pages/Admin/AdminComplaints';
import AdminAnalytics from './Pages/Admin/AdminAnalytics';
import AdminServices from './Pages/Admin/AdminServices';
import Profile from './Pages/Profile';
import ProviderDetails from './Pages/ProviderDetails';
import ComplaintPage from './Pages/ComplaintPage';

import Chat from './Pages/Chat';
import ChatList from './Pages/ChatList';
import ProviderBookings from './Pages/ProviderBookings';
import ProviderEarnings from './Pages/ProviderEarnings';
import ProviderSchedule from './Pages/ProviderSchedule';
import ProviderReviews from './Pages/ProviderReviews';
import CustomerPayments from './Pages/CustomerPayments';
import PaymentForm from './Pages/paymentForm';
import PaymentSuccess from './Pages/paymentSuccess';
import PaymentFailure from './Pages/paymentFailure';
import RatingFeedback from './Pages/RatingFeedback';

const AppContent = () => {
    const location = useLocation();
    const isDashboard = location.pathname.includes('dashboard') ||
        location.pathname.includes('service-provider') ||
        location.pathname.startsWith('/admin') ||
        location.pathname.startsWith('/provider') ||
        location.pathname.startsWith('/customer') ||
        location.pathname.startsWith('/chat/') ||
        location.pathname === '/profile' ||
        location.pathname.startsWith('/payment') ||
        location.pathname === '/rating-feedback';

    return (
        <>
            {!isDashboard && <Navbar />}
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/customer-dashboard" element={<CustomerDashboard />} />
                <Route path="/service-provider" element={<ProviderDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/providers" element={<AdminProviders />} />
                <Route path="/admin/bookings" element={<AdminBookings />} />
                <Route path="/admin/payments" element={<AdminPayments />} />
                <Route path="/admin/reviews" element={<AdminReviews />} />
                <Route path="/admin/complaints" element={<AdminComplaints />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/services" element={<AdminServices />} />
                <Route path="/services" element={<Services />} />
                <Route path="/service-category/:categoryName" element={<CategoryProviders />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/booking-confirmation" element={<BookingConfirmation />} />
                <Route path="/customer/bookings" element={<BookingHistory />} />
                <Route path="/customer/payments" element={<CustomerPayments />} />
                <Route path="/customer/complaints" element={<ComplaintPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/provider-details/:providerId" element={<ProviderDetails />} />
                <Route path="/chat/:receiverId" element={<Chat />} />
                <Route path="/customer/messages" element={<ChatList role="customer" />} />
                <Route path="/provider/messages" element={<ChatList role="provider" />} />
                <Route path="/provider/bookings" element={<ProviderBookings />} />
                <Route path="/provider/earnings" element={<ProviderEarnings />} />
                <Route path="/provider/schedule" element={<ProviderSchedule />} />
                <Route path="/provider/reviews" element={<ProviderReviews />} />
                <Route path="/provider/complaints" element={<ComplaintPage />} />
                <Route path="/payment" element={<PaymentForm />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/failure" element={<PaymentFailure />} />
                <Route path="/rating-feedback" element={<RatingFeedback />} />
            </Routes>
        </>
    );
};

const App = () => {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
};

export default App;
