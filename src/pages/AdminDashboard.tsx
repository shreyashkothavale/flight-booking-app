import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchAllBookings } from '../features/bookings/bookingsSlice';
import { fetchAllLocalFlights, addLocalFlight } from '../features/flights/flightsSlice';
import { Flight } from '../types';
import { FaChartPie, FaPlusCircle, FaPlane } from 'react-icons/fa';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { flights } = useSelector((state: RootState) => state.flights);
  const { bookings } = useSelector((state: RootState) => state.bookings);

  const [isOpen, setIsOpen] = useState(false);
  const [newFlight, setNewFlight] = useState<Partial<Flight>>({
    flightNumber: '', airline: '', departure: '', arrival: '', price: 0, totalSeats: 50, bookedSeats: 0, stops: 0
  });

  useEffect(() => {
    dispatch(fetchAllLocalFlights());
    dispatch(fetchAllBookings());
  }, [dispatch]);

  const handleAddFlight = (e: React.FormEvent) => {
    e.preventDefault();
    const flight: Flight = {
      ...newFlight as Flight,
      id: `F-${Date.now()}`,
      departureTime: new Date().toISOString(),
      arrivalTime: new Date(Date.now() + 7200000).toISOString(),
    };
    dispatch(addLocalFlight(flight));
    setIsOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary rounded-xl text-primary-foreground">
          <FaChartPie className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>

      <Tabs defaultValue="flights" className="w-full">
        <TabsList className="mb-8 bg-muted/50 p-1.5 rounded-xl border border-border/50">
          <TabsTrigger value="flights" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md">Manage Flights</TabsTrigger>
          <TabsTrigger value="bookings" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md">All Bookings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="flights" className="space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-4 p-4 border rounded-xl shadow-sm">
            <h2 className="text-xl font-bold flex items-center gap-2"><FaPlane className="text-muted-foreground" /> Flights Database</h2>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger
                render={
                  <Button size="lg" className="rounded-xl shadow-md bg-gradient-to-r from-primary to-purple-600 hover:shadow-lg transition-all font-bold" />
                }
              >
                <FaPlusCircle className="w-5 h-5 mr-2" /> Add Flight
              </DialogTrigger>
              <DialogContent className="max-w-md w-full sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Flight</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddFlight} className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Flight No</Label>
                    <Input required placeholder="AI-101" onChange={e => setNewFlight({...newFlight, flightNumber: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Airline</Label>
                    <Input required placeholder="Air India" onChange={e => setNewFlight({...newFlight, airline: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>From (IATA)</Label>
                    <Input required placeholder="PNQ" onChange={e => setNewFlight({...newFlight, departure: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>To (IATA)</Label>
                    <Input required placeholder="BOM" onChange={e => setNewFlight({...newFlight, arrival: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Price (₹)</Label>
                    <Input required type="number" onChange={e => setNewFlight({...newFlight, price: Number(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Seats</Label>
                    <Input required type="number" value={newFlight.totalSeats} onChange={e => setNewFlight({...newFlight, totalSeats: Number(e.target.value)})} />
                  </div>
                  <Button type="submit" className="sm:col-span-2 mt-4">Save Flight</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <Table className="min-w-[500px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Flight</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Seats (Booked/Total)</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flights.map(f => (
                    <TableRow key={f.id}>
                      <TableCell>
                        <div className="font-semibold">{f.airline}</div>
                        <div className="text-xs text-muted-foreground">{f.flightNumber}</div>
                      </TableCell>
                      <TableCell className="font-medium">{f.departure} → {f.arrival}</TableCell>
                      <TableCell>
                        <div className="w-full bg-secondary rounded-full h-2 mt-1 overflow-hidden">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${(f.bookedSeats / f.totalSeats) * 100}%` }}></div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{f.bookedSeats} / {f.totalSeats}</div>
                      </TableCell>
                      <TableCell className="font-semibold">₹{f.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <Table className="min-w-[600px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Flight ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map(b => (
                    <TableRow key={b.id}>
                      <TableCell className="font-mono text-sm">{b.id}</TableCell>
                      <TableCell className="text-sm">{b.userId}</TableCell>
                      <TableCell className="text-sm">{b.flightId}</TableCell>
                      <TableCell className="font-semibold">₹{b.totalPrice}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${b.status === 'Confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-destructive/10 text-destructive'}`}>
                          {b.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
