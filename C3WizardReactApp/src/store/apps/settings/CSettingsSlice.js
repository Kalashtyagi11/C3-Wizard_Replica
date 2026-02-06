import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from '../message/MessageSlice';
import BonusSettings from '../../../service/settings/CSettings';

export const getCSettings = createAsyncThunk('CSettings/getCSettings', async (thunkAPI) => {
  try {
    const response = await  BonusSettings.getCSettings() // Assuming this fetches all staff
    return { CSettingList: response.data.data }; // response.data should be the staff array
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});


export const getCSettingsWithDate = createAsyncThunk('CSettings/getCSettings', async ({from,to}, thunkAPI) => {
  try {
  
    const response = (from && to) ?await  BonusSettings.getCSettingsPeriod(from,to):await BonusSettings.getCSettings() // Assuming this fetches all staff
    return { CSettingList: response.data.data }; // response.data should be the staff array
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});


export const bonusSetting = createAsyncThunk('CSettings/bonusSetting', async ({RoleId, year}, thunkAPI) => {
  
  ;
  try {
    const response = await BonusSettings.bonusSetting({RoleId, year}); // Assuming this fetches all staff
    return { bonusSettingList: response.data.data }; // response.data should be the staff array
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});



const CSettingsSlice = createSlice({
  name: 'CSettings',
  initialState: {
    CSettingList: [],
    bonusSettingList:[],
    loading: false,
    error: null,
  },
  // reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getCSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCSettings.fulfilled, (state, action) => {
        ;
        state.loading = false;
        state.CSettingList = action.payload.CSettingList;
      })
      .addCase(getCSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.CSettingList = [];
      })

      .addCase(bonusSetting.pending, (state) => {
        state.loading = true;
      })
      .addCase(bonusSetting.fulfilled, (state, action) => {
        ;
        state.loading = false;
        state.bonusSettingList = action.payload.bonusSettingList;
      })
      .addCase(bonusSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.bonusSettingList = [];
      });
  },
});

export default CSettingsSlice.reducer;
