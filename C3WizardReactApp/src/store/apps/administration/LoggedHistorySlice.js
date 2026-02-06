import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from '../message/MessageSlice';
import UserManagementServices from '../../../service/user-management/UserManagementServices';

export const getLoggedHistoryHandler = createAsyncThunk(
  'Administration/GetLoggedHistory',
  async ({CompanyId,isSelfEmployed,pageNumber,pageSize, fromDate, toDate}, thunkAPI) => {
    const companyId = localStorage.getItem("companyId");
    const roleId = localStorage.getItem("roleId");
    const compId = CompanyId===0||CompanyId?CompanyId : companyId
    try {
      const response = await UserManagementServices.getLoggedHistory(compId,isSelfEmployed, roleId,pageNumber,pageSize, fromDate, toDate);

      return { logsList: response.data.data };
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

const LoggedHistorySlice = createSlice({
  name: 'LoggedHistory',
  initialState: {
    logsList: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearLogs: (state) => {
      state.logsList = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getLoggedHistoryHandler.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLoggedHistoryHandler.fulfilled, (state, action) => {
        state.loading = false;
        state.logsList = action.payload.logsList;
      })
      .addCase(getLoggedHistoryHandler.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.logsList = [];
      });
  },
});

export const { clearLogs } = LoggedHistorySlice.actions;
export default LoggedHistorySlice.reducer;
