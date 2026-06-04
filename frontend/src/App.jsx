import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import CustomerReservations from './pages/customer/CustomerReservations.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import Vehicles from './pages/admin/Vehicles.jsx';
import Customers from './pages/admin/Customers.jsx';
import Reservations from './pages/admin/Reservations.jsx';
import Report from './pages/admin/Report.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AppLayout from './components/AppLayout.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute role="customer" />}>
        <Route element={<AppLayout />}>
          <Route path="/reservations" element={<CustomerReservations />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<AppLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/vehicles" element={<Vehicles />} />
          <Route path="/admin/customers" element={<Customers />} />
          <Route path="/admin/reservations" element={<Reservations />} />
          <Route path="/admin/report" element={<Report />} />
        </Route>
      </Route>
    </Routes>
  );
}
