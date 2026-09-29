export type Role = 'User' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  lastActivity: number | null;
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  totalSeats: number;
  bookedSeats: number;
  stops: number;
}

export interface Passenger {
  firstName: string;
  lastName: string;
  passportNumber: string;
}

export interface Booking {
  id: string;
  userId: string;
  flightId: string;
  passengers: Passenger[];
  totalPrice: number;
  status: 'Confirmed' | 'Failed';
  bookingDate: string;
}
