import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from '../../message/MessageSlice';
import SelfEmployeeervice from '../../../../service/selfEmployee/SelfEmployeeSetting/SelfEmployeeSetting';

export const gerSelfSetting = createAsyncThunk(
  'PersonalDetails/gerSelfSetting',
  async (companyId, thunkAPI) => {
    try {
      const response = await SelfEmployeeervice.gerSelfSetting(companyId);
      return { SelfSettingList: response.data.data };
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

const SelfEmployeeSetting = createSlice({
  name: 'PersonalDetails',
  initialState: {
    SelfSettingList: [],
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder

      .addCase(gerSelfSetting.pending, (state) => {
        state.loading = true;
      })
      .addCase(gerSelfSetting.fulfilled, (state, action) => {
        state.loading = false;
        state.SelfSettingList = action.payload.SelfSettingList;
      })
      .addCase(gerSelfSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.SelfSettingList = [];
      })
     
  },
});

export default SelfEmployeeSetting.reducer;
