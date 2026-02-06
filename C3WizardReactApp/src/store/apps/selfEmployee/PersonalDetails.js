import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from '../message/MessageSlice';
import PersonalService from '../../../service/selfEmployee/PersonalDetails';

export const getPersonalDetail = createAsyncThunk(
  'PersonalDetails/getPersonalDetail',
  async ({ selfEmployeeid }, thunkAPI) => {
    try {
      const response = await PersonalService.getPersonalDetail({ selfEmployeeid });
      return { PersonalData: response.data.data };
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

export const updatePersonal = createAsyncThunk(
  'PersonalDetails/updatePersonal',
  async (updatedFormData, thunkAPI) => {
    try {
      const response = await PersonalService.updatePersonal(updatedFormData);
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

export const getCategory = createAsyncThunk('auth/getCategory', async (_, thunkAPI) => {
  try {
    const response = await PersonalService.getCategory(); // Assuming this fetches all staff
    return { CategoryData: response.data.data }; // response.data should be the staff array
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});

export const getCountry = createAsyncThunk('auth/getCountry', async (_, thunkAPI) => {
  try {
    const response = await PersonalService.getCountry(); // Assuming this fetches all staff
    return { CountryData: response.data.data }; // response.data should be the staff array
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});

const PersonalDetails = createSlice({
  name: 'PersonalDetails',
  initialState: {
    PersonalData: [],
    CategoryData: [],
    CountryData: [],
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder

      .addCase(getPersonalDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPersonalDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.PersonalData = action.payload.PersonalData;
      })
      .addCase(getPersonalDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.PersonalData = [];
      })

      .addCase(updatePersonal.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updatePersonal.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(updatePersonal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(getCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.CategoryData = action.payload.CategoryData;
      })
      .addCase(getCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.CategoryData = [];
      })

      .addCase(getCountry.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCountry.fulfilled, (state, action) => {
        state.loading = false;
        state.CountryData = action.payload.CountryData;
      })
      .addCase(getCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.CountryData = [];
      });
  },
});

export default PersonalDetails.reducer;
