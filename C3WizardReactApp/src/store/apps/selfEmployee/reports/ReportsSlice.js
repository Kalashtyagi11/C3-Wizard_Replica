import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from '../../message/MessageSlice';
import ReportSlice from '../../../../service/selfEmployee/reports/ReportsService';

export const getContribution = createAsyncThunk(
  'Reports/getContribution',
  async (data, thunkAPI) => {
    try {
      const response = await ReportSlice.getContribution(data);
      thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return { ContributionCount: response.data.data };
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

export const previewNWData = createAsyncThunk(
  'Dashboard/previewNWData',
  async ({ headerId, year, monthNo }, thunkAPI) => {
    try {
      const response = await ReportSlice.previewNWData({
        headerId,
        year,
        monthNo,
      });
      console.log('Preeeeeeeeee', response.data);
      return { previewNWResponse: response.data };
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

export const ImportSubmitted = createAsyncThunk(
  'SelfEmployee/ImportSubmitted',
  async (params, thunkAPI) => {
    try {
      const response = await ReportSlice.ImportSubmitted(params);
      thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data.message) || error.message || error.toString();
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const ImportSubmittedLatest = createAsyncThunk(
  'SelfEmployee/ImportSubmittedLatest',
  async (params, thunkAPI) => {
    try {
      const response = await ReportSlice.ImportSubmittedLatest(params);
      thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data.message) || error.message || error.toString();
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const ImportBima = createAsyncThunk(
  'auth/ImportBima',
  async (formData, thunkAPI) => {
    try {
      const response = await ReportSlice.ImportBima(formData);
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

const ReportSelfSlice = createSlice({
  name: 'Reports',
  initialState: {
    ContributionCount: [],
    previewNWDataList: [],
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(getContribution.pending, (state) => {
        state.loading = true;
      })
      .addCase(getContribution.fulfilled, (state, action) => {
        state.loading = false;
        state.ContributionCount = action.payload.ContributionCount;
      })
      .addCase(getContribution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.ContributionCount = [];
      })

      .addCase(previewNWData.pending, (state) => {
        state.loading = true;
      })
      .addCase(previewNWData.fulfilled, (state, action) => {
        state.loading = false;
        state.previewNWDataList = action.payload.previewNWDataList;
      })
      .addCase(previewNWData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.previewNWDataList = [];
      })

      .addCase(ImportSubmitted.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(ImportSubmitted.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })

      .addCase(ImportSubmitted.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(ImportSubmittedLatest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(ImportSubmittedLatest.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })

      .addCase(ImportSubmittedLatest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(ImportBima.pending, (state) => {
        state.loadingModal = true;
        state.error = null;
        state.success = false;
      })
      .addCase(ImportBima.fulfilled, (state) => {
        state.loadingModal = false;
        state.success = true;
      })
      .addCase(ImportBima.rejected, (state, action) => {
        state.loadingModal = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export default ReportSelfSlice.reducer;
