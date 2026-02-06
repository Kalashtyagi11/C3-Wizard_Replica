import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from '../../message/MessageSlice';
import SelfDashboardService from '../../../../service/selfEmployee/dashboard/DashboardService';

export const getDashboardList = createAsyncThunk(
  'SelfDashboard/gerSelfEmployee',
  async ({ CompanyId }, thunkAPI) => {
    try {
      const response = await SelfDashboardService.getDashboardList({ CompanyId });
      return { DashboardData: response.data };
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

export const previewNWData = createAsyncThunk(
  'Dashboard/previewNWData',
  async ({ headerId, year, monthNo }, thunkAPI) => {
    try {
      const response = await SelfDashboardService.previewNWData({
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

export const getReportList = createAsyncThunk(
  'SelfDashboard/getReportList',
  async (data, thunkAPI) => {
    try {
      const response = await SelfDashboardService.getReportList(data);
      return { ReportData: response.data };
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

export const getPreviewNWData = createAsyncThunk(
  'Dashboard/getPreviewNWData',
  async ({ headerId, year, monthNo }, thunkAPI) => {
    try {
      const response = await SelfDashboardService.getPreviewNWData({
        headerId,
        year,
        monthNo,
      });
      console.log('Preeeeeeeeee', response.data);
      return { PreviewData: response.data };
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

export const selfAdminDelete = createAsyncThunk(
  'Dashboard/selfAdminDelete',
  async ({ headerId, userid, type }, thunkAPI) => {
    try {
      const response = await SelfDashboardService.selfAdminDelete(headerId, userid, type); // Assuming this fetches
      thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return { c3DeleteResponse: response.data }; // response.data should be the staff array
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

const SelfDashboardSlice = createSlice({
  name: 'SelfDashboard',
  initialState: {
    DashboardData: [],
    previewNWDataList: [],
    ReportData: [],
    PreviewData: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearDashboardData: (state) => {
      state.DashboardData = [];
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(getDashboardList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDashboardList.fulfilled, (state, action) => {
        state.loading = false;
        state.DashboardData = action.payload.DashboardData;
      })
      .addCase(getDashboardList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.DashboardData = [];
      })

      .addCase(previewNWData.pending, (state) => {
        state.loading = true;
      })
      .addCase(previewNWData.fulfilled, (state, action) => {
        //
        state.loading = false;
        state.previewNWDataList = action.payload.previewNWResponse;
      })
      .addCase(previewNWData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.previewNWDataList = [];
      })

      .addCase(getReportList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReportList.fulfilled, (state, action) => {
        state.loading = false;
        state.ReportData = action.payload.ReportData;
      })
      .addCase(getReportList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.ReportData = [];
      })

      .addCase(selfAdminDelete.pending, (state) => {
        state.loading = true;
      })
      .addCase(selfAdminDelete.fulfilled, (state, action) => {
        state.loading = false;
        state.c3Delete = action.payload.c3DeleteResponse;
      })
      .addCase(selfAdminDelete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.c3Delete = [];
      })

      .addCase(getPreviewNWData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPreviewNWData.fulfilled, (state, action) => {
        //
        state.loading = false;
        state.PreviewData = action.payload.PreviewData;
      })
      .addCase(getPreviewNWData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.PreviewData = [];
      });
  },
});

export const { clearDashboardData } = SelfDashboardSlice.actions;
export default SelfDashboardSlice.reducer;
