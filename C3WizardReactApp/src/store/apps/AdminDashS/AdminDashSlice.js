import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from '../message/MessageSlice';
import dashService from '../../../service/AdminDash/dashService';



export const getLoadUsersListFromAdmin = createAsyncThunk(
  'AdminDashboard1/PaidOrUnpaid',
  async (CompanyId, thunkAPI) => {
   //const roleId = localStorage.getItem("roleId")
   
    try {
      const response = await dashService.GetpaidOrUnpaid(); 
      return { CompanyUsersList: response.data.data }; 
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  },
);




const AdminDashSlice = createSlice({
  name: 'AdminDashboard1',
  initialState: {
    CompanyUsersList: [],
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder

      .addCase(getLoadUsersListFromAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLoadUsersListFromAdmin.fulfilled, (state, action) => {
        
        state.loading = false;
         //state.usersList = action.payload.usersList;
         state.CompanyUsersList = action.payload.CompanyUsersList;
        // state.selfUsersList = action.payload.selfUsersList;
      })
      .addCase(getLoadUsersListFromAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.CompanyUsersList = [];
      });
  },
});

export default AdminDashSlice.reducer;
