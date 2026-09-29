import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchUserBookings } from '../features/bookings/bookingsSlice';
import { FaTicketAlt, FaPlaneDeparture } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const UserBookings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { bookings, loading } = useSelector((state: RootState) => state.bookings);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserBookings(user.id));
    }
  }, [dispatch, user]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-gradient-to-br from-primary to-purple-600 rounded-2xl shadow-lg text-white">
          <FaTicketAlt className="w-8 h-8 -rotate-12" />
        </div>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600 drop-shadow-sm">My Bookings</h1>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading your bookings...</p>
      ) : bookings.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">You have no bookings yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {bookings.map(booking => (
            <Card key={booking.id} className="hover:shadow-lg transition-shadow border-t-4 border-t-primary/80">
              <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-start gap-4 w-full md:w-auto">
                  <div className="p-4 bg-primary/10 text-primary rounded-xl hidden sm:block">
                    <FaPlaneDeparture className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 uppercase font-bold tracking-wider">Booking ID: <span className="font-mono text-foreground bg-muted px-2 py-0.5 rounded">{booking.id}</span></p>
                    <p className="text-xl font-bold text-foreground">Flight {booking.flightId}</p>
                    <p className="text-sm font-semibold text-primary mt-1">{booking.passengers.length} Passenger(s)</p>
                  </div>
                </div>
                <div className="text-left w-full md:w-auto md:text-right bg-muted/30 p-4 rounded-xl border border-border/50 flex-1 md:flex-none">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm inline-block mb-3 ${booking.status === 'Confirmed' ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white' : 'bg-destructive/10 text-destructive'}`}>
                    {booking.status}
                  </span>
                  <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">₹{booking.totalPrice}</p>
                  <p className="text-xs text-muted-foreground font-bold uppercase mt-1">{new Date(booking.bookingDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookings;
