import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from '../message/MessageSlice';
import HolidayService from '../../../service/cGeneration/holiday';

export const getHoliday = createAsyncThunk('Holiday/getHoliday', async (CompanyId, thunkAPI) => {
  try {
    const response = await HolidayService.getHoliday(CompanyId); // Assuming this fetches all staff
    return { HolidayListResponse: response.data.data }; // response.data should be the staff array
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});

export const employeeAndWokingEmployeelist = createAsyncThunk(
  'Holiday/employeeAndWokingEmployeelist',
  async (data, thunkAPI) => {
    console.log('EmployeeAndWokinglist load', data);
    try {
      const response = await HolidayService.getEmployeeAndWoking(data); // Assuming this fetches all staff
      return { employeeResponse: response.data.data }; // response.data should be the staff array
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

export const saveHoliday = createAsyncThunk('Holiday/saveHoliday', async (data, thunkAPI) => {
  try {
    const response = await HolidayService.saveHoliday(data); // Assuming this fetches all staff
    return { saveHolidayResponse: response.data }; // response.data should be the staff array
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});
export const deleteHoliday = createAsyncThunk('Holiday/deleteHoliday', async (id, thunkAPI) => {
  try {
    const response = await HolidayService.deleteHoliday(id); // Assuming this fetches all staff
    return { deleteHolidayResponse: response.data }; // response.data should be the staff array
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});

export const getAllHolidayPayById = createAsyncThunk(
  'Holiday/GetAllHolidayPayById',
  async (data, thunkAPI) => {
    try {
      const response = await HolidayService.GetAllHolidayPayById(data); // Assuming this fetches all
      // thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return { HolidayPayByIdResponse: response.data.data || response.data }; // response.data should be the staff array
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

export const editHoliday = createAsyncThunk('Holiday/editHoliday', async (data, thunkAPI) => {
  try {
    const response = await HolidayService.editHoliday(data); // Assuming this fetches all staff
    return { editHolidayResponse: response.data }; // response.data should be the staff array
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});

const HolidaySlice = createSlice({
  name: 'Holiday',
  initialState: {
    HolidayList: [],
    EmployeeAndWokinglist: [],
    delete: [],
    SaveHoliday: [],
    editHoliday: [],
    HolidayPayById: [],
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder

      .addCase(getHoliday.pending, (state) => {
        state.loading = true;
      })
      .addCase(getHoliday.fulfilled, (state, action) => {
        //
        state.loading = false;
        state.HolidayList = action.payload.HolidayListResponse;
      })
      .addCase(getHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.HolidayList = [];
      })

      .addCase(employeeAndWokingEmployeelist.pending, (state) => {
        state.loading = true;
      })
      .addCase(employeeAndWokingEmployeelist.fulfilled, (state, action) => {
        //
        state.loading = false;
        state.EmployeeAndWokinglist = action.payload.employeeResponse;
      })
      .addCase(employeeAndWokingEmployeelist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.EmployeeAndWokinglist = [];
      })

      .addCase(saveHoliday.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveHoliday.fulfilled, (state, action) => {
        //
        state.loading = false;
        state.SaveHoliday = action.payload.saveHolidayResponse;
      })
      .addCase(saveHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.SaveHoliday = [];
      })

      .addCase(deleteHoliday.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteHoliday.fulfilled, (state, action) => {
        //
        state.loading = false;
        state.delete = action.payload.deleteHolidayResponse;
      })
      .addCase(deleteHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.delete = [];
      })

      .addCase(getAllHolidayPayById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllHolidayPayById.fulfilled, (state, action) => {
        //
        state.loading = false;
        state.HolidayPayById = action.payload.HolidayPayByIdResponse;
      })
      .addCase(getAllHolidayPayById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.HolidayPayById = [];
      })

      .addCase(editHoliday.pending, (state) => {
        state.loading = true;
      })
      .addCase(editHoliday.fulfilled, (state, action) => {
        //
        state.loading = false;
        state.editHoliday = action.payload.editHolidayResponse;
      })
      .addCase(editHoliday.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.editHoliday = [];
      });
  },
});

export default HolidaySlice.reducer;
