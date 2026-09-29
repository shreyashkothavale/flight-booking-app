import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { logout, updateActivity } from './features/auth/authSlice';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BookingDetails from './pages/BookingDetails';
import UserBookings from './pages/UserBookings';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, lastActivity } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    let interval: any;
    if (isAuthenticated) {
      interval = setInterval(() => {
        if (lastActivity && Date.now() - lastActivity > SESSION_TIMEOUT) {
          dispatch(logout());
          alert('Session expired due to inactivity.');
        }
      }, 10000); // Check every 10s
    }
    return () => clearInterval(interval);
  }, [isAuthenticated, lastActivity, dispatch]);

  const handleActivity = () => {
    if (isAuthenticated) {
      dispatch(updateActivity());
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [isAuthenticated, dispatch]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />
            
            <Route element={<ProtectedRoute allowedRoles={['User', 'Admin']} />}>
              <Route path="/" element={<Home />} />
              <Route path="/book/:flightId" element={<BookingDetails />} />
              <Route path="/my-bookings" element={<UserBookings />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
