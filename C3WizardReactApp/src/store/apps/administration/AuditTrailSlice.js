import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from '../message/MessageSlice';
import UserManagementServices from '../../../service/user-management/UserManagementServices';

// Async thunk for fetching audit trail
export const getUserAuditTrail = createAsyncThunk(
  'Administration/getUserAuditTrail',
  async (payload,  thunkAPI) => {
    try {
      const response = await UserManagementServices.getUserAuditTrail(payload);
      return { auditTrails: response.data.data };
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue();
    }
  },
);

// Initial state
const initialState = {
  auditTrails: null,
  loading: false,
  error: null,
};

// Slice
const AuditTrailSlice = createSlice({
  name: 'AuditTrail',
  initialState,
  reducers: {
    // ✅ Reset audit trail data
    resetAuditTrail: (state) => {
      state.auditTrails = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserAuditTrail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserAuditTrail.fulfilled, (state, action) => {
        state.loading = false;
        state.auditTrails = action.payload.auditTrails;
      })
      .addCase(getUserAuditTrail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.auditTrails = null;
      });
  },
});

// Export actions and reducer
export const { resetAuditTrail } = AuditTrailSlice.actions;
export default AuditTrailSlice.reducer;
