import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { Passenger } from '../types';
import { addBooking } from '../features/bookings/bookingsSlice';
import { db } from '../lib/db';
import { FaCreditCard, FaCheckCircle, FaTimesCircle, FaUser } from 'react-icons/fa';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';

const BookingDetails = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [flight, setFlight] = useState<any>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([{ firstName: '', lastName: '', passportNumber: '' }]);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [bookingId, setBookingId] = useState<string>('');

  useEffect(() => {
    db.flights.getItem(flightId as string).then(f => {
      if (f) setFlight(f);
    });
  }, [flightId]);

  const addPassenger = () => {
    setPassengers([...passengers, { firstName: '', lastName: '', passportNumber: '' }]);
  };

  const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStatus('processing');
    
    setTimeout(async () => {
      const isSuccess = Math.random() > 0.2; 
      if (isSuccess) {
        setPaymentStatus('success');
        const bId = `BKG-${Date.now()}`;
        setBookingId(bId);
        
        await dispatch(addBooking({
          id: bId,
          userId: user!.id,
          flightId: flightId!,
          passengers,
          totalPrice: (flight?.price || 5000) * passengers.length,
          status: 'Confirmed',
          bookingDate: new Date().toISOString()
        }));
      } else {
        setPaymentStatus('failed');
      }
    }, 2000);
  };

  if (paymentStatus === 'success') {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <Card className="border-t-4 border-t-green-500 shadow-xl">
          <CardHeader>
            <FaCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6 drop-shadow-md" />
            <CardTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">Booking Confirmed!</CardTitle>
            <CardDescription className="text-lg">Your flight has been successfully booked.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-muted/50 to-muted p-6 rounded-2xl inline-block mb-8 border border-muted-foreground/20 shadow-inner">
              <p className="text-sm text-muted-foreground mb-2 uppercase tracking-widest font-bold">Booking Reference</p>
              <p className="font-mono text-3xl font-black text-foreground">{bookingId}</p>
            </div>
            <div>
              <Button onClick={() => navigate('/my-bookings')} className="w-full max-w-xs mx-auto text-lg py-6 rounded-xl shadow-md">
                View My Bookings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPrice = (flight?.price || 5000) * passengers.length;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600 mb-8 drop-shadow-sm">Complete your booking</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-md border-t-4 border-t-primary/80">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <FaUser className="text-primary w-5 h-5" /> Passenger Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form id="bookingForm" onSubmit={handlePayment} className="space-y-6">
                {passengers.map((p, index) => (
                  <div key={index} className="p-5 border border-primary/20 bg-muted/20 rounded-2xl space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-purple-500"></div>
                    <h4 className="font-bold text-lg text-primary flex items-center gap-2">Passenger {index + 1}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-bold text-muted-foreground text-xs uppercase tracking-wider">First Name</Label>
                        <Input required value={p.firstName} onChange={e => updatePassenger(index, 'firstName', e.target.value)} className="bg-background shadow-sm" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-muted-foreground text-xs uppercase tracking-wider">Last Name</Label>
                        <Input required value={p.lastName} onChange={e => updatePassenger(index, 'lastName', e.target.value)} className="bg-background shadow-sm" />
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <Label className="font-bold text-muted-foreground text-xs uppercase tracking-wider">Passport / ID Number</Label>
                        <Input required value={p.passportNumber} onChange={e => updatePassenger(index, 'passportNumber', e.target.value)} className="bg-background shadow-sm font-mono" />
                      </div>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addPassenger} className="w-full border-dashed border-2 py-6 text-primary hover:text-primary hover:bg-primary/10 transition-colors font-bold rounded-xl">
                  + Add Another Passenger
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card className="shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-primary text-white rounded-lg shadow-md"><FaCreditCard className="w-5 h-5" /></div> Payment Simulation
              </CardTitle>
              <CardDescription className="pt-2">Clicking Pay will simulate a payment gateway response.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {paymentStatus === 'failed' && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-xl mb-6 text-sm flex items-center gap-3 font-bold border border-destructive/20">
                  <FaTimesCircle className="w-6 h-6" /> Payment failed. Please try again.
                </div>
              )}
              <Button form="bookingForm" type="submit" disabled={paymentStatus === 'processing'} className="w-full text-xl font-bold h-16 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all bg-gradient-to-r from-primary to-purple-600">
                {paymentStatus === 'processing' ? 'Processing Secure Payment...' : `Pay ₹${totalPrice}`}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader className="border-b pb-4 mb-4">
              <CardTitle>Price Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Base Fare (x{passengers.length})</span>
                <span>₹{totalPrice - 500}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Taxes & Fees</span>
                <span>₹500</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-4 text-foreground">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
