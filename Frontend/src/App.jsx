import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Navbar from './Pages/Navbar';
import CustomerDashboard from './Pages/CustomerDashboard';
import ProviderDashboard from './Pages/ProviderDashboard';
import AdminDashboard from './Pages/AdminDashboard';
import ForgotPassword from './Pages/ForgotPassword';
import Services from './Pages/Services';
import BookingHistory from './Pages/BookingHistory';
import BookingConfirmation from './Pages/BookingConfirmation';

const App = () => {
  return (
    <>
    <BrowserRouter>
    <Navbar/>
    <Routes>
     <Route path='/'   element={<Home/>}/>
     <Route path='/login'  element={<Login/>}/>
     <Route path="/register" element={<Register/>}/>
     <Route path="/forgot-password" element={<ForgotPassword/>}/>
     <Route path="/customer-dashboard" element={<CustomerDashboard/>}/>
     <Route path="/service-provider" element={<ProviderDashboard/>}/>
     <Route path="/admin-dashboard" element={<AdminDashboard/>}/>
     <Route path="/services" element={<Services/>}/>
     <Route path="/booking-confirmation" element={<BookingConfirmation/>}/>
     <Route path="/booking-history" element={<BookingHistory/>}/>
    </Routes>
  </BrowserRouter>
    </>
  )
}

export default App
