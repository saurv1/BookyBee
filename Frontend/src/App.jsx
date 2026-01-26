import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import CustomerDashboard from './Pages/CustomerDashboard';
import ProviderDashboard from './Pages/ProviderDashboard';
import AdminDashboard from './Pages/AdminDashboard';

const App = () => {
  return (
    <>
    <BrowserRouter>
    <Routes>
     <Route path='/'   element={<Home/>}/>
     <Route path='/login'  element={<Login/>}/>
     <Route path="/register" element={<Register/>}/>
     <Route path="/customer-dashboard" element={<CustomerDashboard/>}/>
     <Route path="/service-provider" element={<ProviderDashboard/>}/>
     <Route path="/admin-dashboard" element={<AdminDashboard/>}/>
    </Routes>
  </BrowserRouter>
    </>
  )
}

export default App
