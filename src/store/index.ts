import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import flightsReducer from '../features/flights/flightsSlice';
import bookingsReducer from '../features/bookings/bookingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    flights: flightsReducer,
    bookings: bookingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
