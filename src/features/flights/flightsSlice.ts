import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Flight } from '../../types';
import axios from 'axios';
import { db } from '../../lib/db';

interface FlightsState {
  flights: Flight[];
  loading: boolean;
  error: string | null;
}

const initialState: FlightsState = {
  flights: [],
  loading: false,
  error: null,
};

// Replace this with the actual API Key
const API_KEY = '4f9591b1ebe4d31f0e691cf594e5bbe6';

export const searchFlights = createAsyncThunk(
  'flights/search',
  async (params: any, { rejectWithValue }) => {
    try {
      // First, get local flights matching criteria (simple mock matching)
      const localFlights: Flight[] = [];
      await db.flights.iterate((value: Flight) => {
        if (!params.dep_iata || value.departure.toLowerCase().includes(params.dep_iata.toLowerCase())) {
          localFlights.push(value);
        }
      });
      
      // Let's try to fetch from AviationStack if possible
      let apiFlights: Flight[] = [];
      try {
        const response = await axios.get('http://api.aviationstack.com/v1/flights', {
          params: {
            access_key: API_KEY,
            dep_iata: params.dep_iata,
            arr_iata: params.arr_iata,
          }
        });
        
        if (response.data && response.data.data) {
           apiFlights = response.data.data.map((f: any) => ({
             id: f.flight.iata || Math.random().toString(),
             flightNumber: f.flight.iata,
             airline: f.airline.name,
             departure: f.departure.iata,
             arrival: f.arrival.iata,
             departureTime: f.departure.scheduled,
             arrivalTime: f.arrival.scheduled,
             price: Math.floor(Math.random() * (15000 - 3000 + 1) + 3000), // Fake price since API doesn't provide
             totalSeats: 150,
             bookedSeats: Math.floor(Math.random() * 100),
             stops: 0,
           }));
        }
      } catch (err) {
        console.error("AviationStack API failed, using local data", err);
      }

      return [...localFlights, ...apiFlights];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllLocalFlights = createAsyncThunk(
  'flights/fetchAll',
  async () => {
    const localFlights: Flight[] = [];
    await db.flights.iterate((value: Flight) => {
      localFlights.push(value);
    });
    return localFlights;
  }
);


const flightsSlice = createSlice({
  name: 'flights',
  initialState,
  reducers: {
    addLocalFlight: (state, action: PayloadAction<Flight>) => {
      state.flights.push(action.payload);
    },
    updateLocalFlight: (state, action: PayloadAction<Flight>) => {
      const index = state.flights.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.flights[index] = action.payload;
      }
    },
    deleteLocalFlight: (state, action: PayloadAction<string>) => {
      state.flights = state.flights.filter(f => f.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchFlights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchFlights.fulfilled, (state, action) => {
        state.loading = false;
        state.flights = action.payload;
      })
      .addCase(searchFlights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllLocalFlights.fulfilled, (state, action) => {
        state.flights = action.payload;
      });
  },
});

export const { addLocalFlight, updateLocalFlight, deleteLocalFlight } = flightsSlice.actions;
export default flightsSlice.reducer;
