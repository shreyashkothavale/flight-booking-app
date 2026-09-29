import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../features/auth/authSlice';
import { FaPlane, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { Button } from './ui/button';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm bg-background border-b">
      <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-foreground hover:opacity-80 transition-opacity">
        <FaPlane className="w-5 h-5 text-primary" />
        <span>Flight Booking</span>
      </Link>

      <div className="flex items-center gap-6">
        {isAuthenticated && user ? (
          <>
            {user.role === 'Admin' ? (
              <Link to="/admin" className="text-muted-foreground hover:text-primary font-medium transition-colors hidden md:block">Admin Dashboard</Link>
            ) : (
              <Link to="/my-bookings" className="text-muted-foreground hover:text-primary font-medium transition-colors hidden md:block">My Bookings</Link>
            )}

            <div className="flex items-center gap-4 md:border-l pl-0 md:pl-6">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <FaUserCircle className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium hidden sm:inline">{user.name}</span>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-md">{user.role}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
                <FaSignOutAlt className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
