import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Booking } from '../../types';
import { db } from '../../lib/db';

interface BookingsState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingsState = {
  bookings: [],
  loading: false,
  error: null,
};

export const fetchUserBookings = createAsyncThunk(
  'bookings/fetchUser',
  async (userId: string) => {
    const userBookings: Booking[] = [];
    await db.bookings.iterate((value: Booking) => {
      if (value.userId === userId) {
        userBookings.push(value);
      }
    });
    return userBookings;
  }
);

export const fetchAllBookings = createAsyncThunk(
  'bookings/fetchAll',
  async () => {
    const allBookings: Booking[] = [];
    await db.bookings.iterate((value: Booking) => {
      allBookings.push(value);
    });
    return allBookings;
  }
);

export const addBooking = createAsyncThunk(
  'bookings/add',
  async (booking: Booking) => {
    await db.bookings.setItem(booking.id, booking);
    // Also update flight booked seats
    const flight: any = await db.flights.getItem(booking.flightId);
    if (flight) {
      flight.bookedSeats += booking.passengers.length;
      await db.flights.setItem(flight.id, flight);
    }
    return booking;
  }
);


const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
      })
      .addCase(addBooking.fulfilled, (state, action) => {
        state.bookings.push(action.payload);
      });
  }
});

export default bookingsSlice.reducer;
