import localforage from 'localforage';

export const db = {
  users: localforage.createInstance({
    name: 'flightApp',
    storeName: 'users'
  }),
  flights: localforage.createInstance({
    name: 'flightApp',
    storeName: 'flights'
  }),
  bookings: localforage.createInstance({
    name: 'flightApp',
    storeName: 'bookings'
  }),
};

export const initDB = async () => {
  const users = await db.users.length();
  if (users === 0) {
    // We could pre-seed an admin user if we want
  }

  const flights = await db.flights.length();
  if (flights === 0) {
    await db.flights.setItem('f1', {
      id: 'f1',
      flightNumber: 'AI-101',
      airline: 'Air India',
      departure: 'Pune',
      arrival: 'Mumbai',
      departureTime: '10:00 AM',
      arrivalTime: '11:00 AM',
      price: 2500,
      totalSeats: 50,
      bookedSeats: 12,
      stops: 0,
    });
  }
};
