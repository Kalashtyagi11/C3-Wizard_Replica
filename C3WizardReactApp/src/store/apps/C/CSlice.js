import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from '../message/MessageSlice';
import CServices from '../../../service/c3Service/C3';

export const getBonus = createAsyncThunk('C3Slice/getBonus', async (CompanyId, thunkAPI) => {
  try {
    const response = await CServices.getBonus(CompanyId); // Assuming this fetches all staff
    return { CList: response.data.data }; // response.data should be the staff array
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});

export const deleteBonus = createAsyncThunk('C3Slice/deleteBonus', async (data, thunkAPI) => {
  try {
    const response = await CServices.deleteBonus(data); // Assuming this fetches all staff
    return { deleteBonusResponse: response.data }; // response.data should be the staff array
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage({ message, type: 'error' }));
    return thunkAPI.rejectWithValue();
  }
});

export const saveBonus = createAsyncThunk('C3Slice/saveBonus', async (data, thunkAPI) => {
  try {
    const response = await CServices.saveBonus(data); // Assuming this fetches all staff
    return { saveBonusResponse: response.data }; // response.data should be the staff array
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage({ message, type: 'error' }));
    return thunkAPI.rejectWithValue();
  }
});

export const getEmployee = createAsyncThunk('C3Slice/getEmployee', async (CompanyId, thunkAPI) => {
  try {
    const response = await CServices.GetEmployeeList(CompanyId); // Assuming this fetches all staff
    return { EmployeeList: response.data.data }; // response.data should be the staff array
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});

export const saveEdit = createAsyncThunk('C3Slice/saveEdit', async (data, thunkAPI) => {
  try {
    const response = await CServices.saveEdit(data); // Assuming this fetches all staff
    return { saveEditResponse: response.data }; // response.data should be the staff array
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});

const CSlice = createSlice({
  name: 'CSlice',
  initialState: {
    CList: [],
    delete: [],
    save: [],
    edit: [],
    employee: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getBonus.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBonus.fulfilled, (state, action) => {
        state.loading = false;
        state.CList = action.payload.CList;
      })
      .addCase(getBonus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.CList = [];
      })

      .addCase(deleteBonus.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBonus.fulfilled, (state, action) => {
        state.loading = false;
        state.delete = action.payload.deleteBonusResponse;
      })
      .addCase(deleteBonus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.delete = [];
      })

      .addCase(saveBonus.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveBonus.fulfilled, (state, action) => {
        state.loading = false;
        state.save = action.payload.saveBonusResponse;
      })
      .addCase(saveBonus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.save = [];
      })

      .addCase(getEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload.EmployeeList;
      })
      .addCase(getEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.employee = [];
      })

      .addCase(saveEdit.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveEdit.fulfilled, (state, action) => {
        state.loading = false;
        state.edit = action.payload.saveEditResponse;
      })
      .addCase(saveEdit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.edit = [];
      });
  },
});

export default CSlice.reducer;
