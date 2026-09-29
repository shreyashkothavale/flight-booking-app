import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import { searchFlights } from '../features/flights/flightsSlice';
import { FaSearch, FaFilter, FaArrowRight, FaPlane } from 'react-icons/fa';
import { Flight } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { flights, loading } = useSelector((state: RootState) => state.flights);
  
  const [tripType, setTripType] = useState<'oneway' | 'round' | 'multi'>('oneway');
  const [depIata, setDepIata] = useState('PNQ');
  const [arrIata, setArrIata] = useState('BOM');
  
  // Filters
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [selectedStops, setSelectedStops] = useState<string>('any');
  const [timeSlot, setTimeSlot] = useState<string>('any');

  useEffect(() => {
    dispatch(searchFlights({ dep_iata: '', arr_iata: '' }));
  }, [dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(searchFlights({ dep_iata: depIata, arr_iata: arrIata }));
  };

  const getFilteredFlights = () => {
    return flights.filter(f => {
      if (f.price > maxPrice) return false;
      if (selectedStops !== 'any') {
        const stops = parseInt(selectedStops);
        if (f.stops !== stops) return false;
      }
      if (timeSlot !== 'any') {
        const hour = new Date(f.departureTime).getHours();
        if (timeSlot === 'morning' && (hour < 6 || hour >= 12)) return false;
        if (timeSlot === 'afternoon' && (hour < 12 || hour >= 18)) return false;
        if (timeSlot === 'evening' && (hour < 18 || hour >= 22)) return false;
        if (timeSlot === 'night' && (hour >= 22 || hour < 6)) return false;
      }
      return true;
    });
  };

  const filteredFlights = getFilteredFlights();

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Filters */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FaFilter className="w-4 h-4" /> Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Max Price: ₹{maxPrice}</Label>
              <input type="range" min="1000" max="30000" step="500" className="w-full accent-primary" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
            </div>
            
            <div className="space-y-2">
              <Label>Stops</Label>
              <Select value={selectedStops} onValueChange={setSelectedStops}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="0">Non-stop</SelectItem>
                  <SelectItem value="1">1 Stop</SelectItem>
                  <SelectItem value="2">2+ Stops</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Departure Time</Label>
              <Select value={timeSlot} onValueChange={setTimeSlot}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="morning">Morning (6AM - 12PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
                  <SelectItem value="evening">Evening (6PM - 10PM)</SelectItem>
                  <SelectItem value="night">Night (10PM - 6AM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        {/* Search Box */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Search Flights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-6 border-b pb-4">
              {(['oneway', 'round', 'multi'] as const).map(type => (
                <Button 
                  key={type}
                  variant={tripType === type ? "default" : "ghost"}
                  onClick={() => setTripType(type)}
                  className="rounded-full px-6"
                >
                  {type === 'oneway' ? 'One Way' : type === 'round' ? 'Round Trip' : 'Multi City'}
                </Button>
              ))}
            </div>
            
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label>From (IATA)</Label>
                <Input className="h-12 text-lg uppercase" placeholder="PNQ" value={depIata} onChange={e => setDepIata(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>To (IATA)</Label>
                <Input className="h-12 text-lg uppercase" placeholder="BOM" value={arrIata} onChange={e => setArrIata(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" className="h-12" />
              </div>
              <Button type="submit" size="lg" className="h-12 w-full text-md">
                <FaSearch className="w-4 h-4 mr-2" /> Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-foreground">
            {loading ? 'Searching...' : `Found ${filteredFlights.length} flights`}
          </h3>
          
          {filteredFlights.map((flight: Flight) => (
            <Card key={flight.id} className="hover:shadow-md transition-shadow group overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  
                  <div className="flex-1 w-full grid grid-cols-3 items-center text-center md:text-left p-6">
                    <div>
                      <p className="text-2xl font-bold">{new Date(flight.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) || flight.departureTime}</p>
                      <p className="text-sm text-muted-foreground">{flight.departure}</p>
                    </div>
                    <div className="flex flex-col items-center px-4">
                      <p className="text-xs text-muted-foreground mb-1">{flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop(s)`}</p>
                      <div className="w-full h-px bg-border relative flex items-center justify-center">
                        <FaPlane className="w-4 h-4 text-muted-foreground absolute bg-background px-1" />
                      </div>
                      <p className="text-xs font-medium text-foreground mt-2">{flight.airline}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{new Date(flight.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) || flight.arrivalTime}</p>
                      <p className="text-sm text-muted-foreground">{flight.arrival}</p>
                    </div>
                  </div>

                  <div className="w-full md:w-auto bg-muted/20 border-t md:border-t-0 md:border-l p-6 flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 min-w-[200px]">
                    <div className="text-left md:text-center">
                      <p className="text-xs text-muted-foreground mb-1">Price per adult</p>
                      <p className="text-2xl font-bold">₹{flight.price}</p>
                    </div>
                    <Button onClick={() => navigate(`/book/${flight.id}`)} className="w-full">
                      Book Now
                    </Button>
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
