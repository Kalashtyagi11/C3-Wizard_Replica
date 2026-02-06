import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from '../../message/MessageSlice';
import SelfDashboardService from '../../../../service/selfEmployee/userManagement/UserManagementService';

export const getPersonal = createAsyncThunk('auth/getPersonal', async (userId, thunkAPI) => {
  try {
    const response = await SelfDashboardService.getPersonal(userId); // Assuming this fetches all staff
    return { PersonalData: response.data.data }; // response.data should be the staff array
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});

export const updatePersonal = createAsyncThunk(
  'auth/updatePersonal',
  async (formDataToSend, thunkAPI) => {
    
    try {
      
      const response = await SelfDashboardService.updatePersonal(formDataToSend);
      thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response && error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const userManagementSlice = createSlice({
  name: 'SelfDashboard',
  initialState: {
    loading: false,
    error: null,
    PersonalData:[],
  },

  extraReducers: (builder) => {
    builder

      .addCase(getPersonal.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPersonal.fulfilled, (state, action) => {
        state.loading = false;
        state.PersonalData = action.payload.PersonalData;
      })
      .addCase(getPersonal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.PersonalData = [];
      })

      .addCase(updatePersonal.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updatePersonal.fulfilled, (state, action) => {
        
        state.loading = false;
        state.PersonalData = action.payload.data.PersonalData;

        state.error = null;
      })
      .addCase(updatePersonal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export default userManagementSlice.reducer;
