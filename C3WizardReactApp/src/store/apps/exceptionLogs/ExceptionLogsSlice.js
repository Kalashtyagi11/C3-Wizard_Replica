import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from '../message/MessageSlice';
import ExceptionService from '../../../service/exceptionLogs/ExceptionLogs';

export const getException = createAsyncThunk(
  'Exception/getException',
  async (queryParams, thunkAPI) => {

    try {
      const response = await ExceptionService.getException(queryParams);
      return { ExceptionData: response.data };
    } catch (error) {
      const message = error.response?.data?.msg || error.message || error.toString();
      thunkAPI.dispatch(setMessage({message, type:  'error'}));
      return thunkAPI.rejectWithValue();
    }
  },
);

const ExceptionLogsSlice = createSlice({
  name: 'ExceptionLogs',
  initialState: {
    Exception: null,
    ExceptionData: [],
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(getException.pending, (state) => {
        state.loading = true;
      })
      .addCase(getException.fulfilled, (state, action) => {
        state.loading = false;
        state.ExceptionData = action.payload.ExceptionData;
        state.error = null;
      })
      .addCase(getException.rejected, (state, action) => {
        state.loading = false;
        state.ExceptionData.data = [];
        state.error = action.error.message;
      });
  },
});

export default ExceptionLogsSlice.reducer;
