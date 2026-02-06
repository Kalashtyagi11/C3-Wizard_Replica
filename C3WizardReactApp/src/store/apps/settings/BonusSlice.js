import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from '../message/MessageSlice';
import BonusSettings from '../../../service/settings/BonusSetting';

export const getBonusSettings = createAsyncThunk('BonusSlice/getBonusSettings', async (CompanyId, thunkAPI) => {
  try {
    const response = await BonusSettings.getBonusSettings(CompanyId); // Assuming this fetches all staff
    return { BonusList: response.data.data }; // response.data should be the staff array
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});

const BonusSlice = createSlice({
  name: 'CSlice',
  initialState: {
    BonusList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getBonusSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBonusSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.BonusList = action.payload.BonusList;
      })
      .addCase(getBonusSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.BonusList = [];
      });
  },
});

export default BonusSlice.reducer;