import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from '../../message/MessageSlice';
import UserAuditTrailService from '../../../../service/selfEmployee/userAuditTrail/UserAuditTrail'; // Renaming for clarity

// Define the async action using createAsyncThunk
export const getLoadUsers = createAsyncThunk(
  'UserAuditTrail/getLoadUsers',
  async ({ CompanyId }, thunkAPI) => {
    
    try {
      // Assuming UserAuditTrailService has a method getCategory
      const response = await UserAuditTrailService.getLoadUsers({ CompanyId });
      return { CategoryData: response.data.data }; // Assuming the response contains `data.data` with the Category data
    } catch (error) {
      // Handle error and dispatch a message
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message)); 
      return thunkAPI.rejectWithValue(); 
    }
  },
);

export const getLoggedInHistory = createAsyncThunk(
  'UserAuditTrail/getLoggedInHistory',
  async ({ CompanyId, isSelfEmployed, roleId,  pageNumber,
    pageSize, fromDate, toDate }, thunkAPI) => {
    
    try {
      // Assuming UserAuditTrailService has a method getCategory
      const response = await UserAuditTrailService.getLoggedInHistory({ CompanyId, isSelfEmployed, roleId,  pageNumber,
        pageSize,fromDate, toDate });
      return { getLoggedData: response.data.data }; // Assuming the response contains `data.data` with the Category data
    } catch (error) {
      // Handle error and dispatch a message
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message)); 
      return thunkAPI.rejectWithValue(); 
    }
  },
);

// Define the slice
const userAuditTrailSlices = createSlice({
  name: 'UserAuditTrail', // Changed the name for clarity
  initialState: {
    auditTrails: null,
    CategoryData: [],
    getLoggedData:[],
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(getLoadUsers.pending, (state) => {
        state.loading = true; // Set loading to true when the async action is pending
      })
      .addCase(getLoadUsers.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false when action is fulfilled
        state.CategoryData = action.payload.CategoryData; // Save the data
        state.error = null; // Clear any previous errors
      })
      .addCase(getLoadUsers.rejected, (state, action) => {
        state.loading = false; // Set loading to false when action is rejected
        state.error = action.error.message; // Save error message
      })

      .addCase(getLoggedInHistory.pending, (state) => {
        state.loading = true; // Set loading to true when the async action is pending
      })
      .addCase(getLoggedInHistory.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false when action is fulfilled
        state.getLoggedData = action.payload.getLoggedData; // Save the data
        state.error = null; // Clear any previous errors
      })
      .addCase(getLoggedInHistory.rejected, (state, action) => {
        state.loading = false; // Set loading to false when action is rejected
        state.error = action.error.message; // Save error message
      });
  },
});

// Export the reducer for use in the store
export default userAuditTrailSlices.reducer;
