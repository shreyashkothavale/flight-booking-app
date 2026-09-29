import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '../../types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  lastActivity: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.lastActivity = Date.now();
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.lastActivity = null;
    },
    updateActivity: (state) => {
      if (state.isAuthenticated) {
        state.lastActivity = Date.now();
      }
    }
  }
});

export const { loginSuccess, logout, updateActivity } = authSlice.actions;
export default authSlice.reducer;
