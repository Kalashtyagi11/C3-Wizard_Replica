import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from '../message/MessageSlice';
import RoleManagementsService from '../../../service/settings/RoleManagements';

// Async thunk for fetching the role list
export const getRoleList = createAsyncThunk('Role/getRoleList', async (roleId, thunkAPI) => {
  
  try {
    const response = await RoleManagementsService.getRoleList(roleId);

    return response.data.data; // Assuming the data is in response.data.data
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();

    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message);
  }
});

export const getRoleListSide = createAsyncThunk(
  'Role/getRoleListSide',
  async (roleId, thunkAPI) => {
    try {
      const response = await RoleManagementsService.getRoleListSide(roleId);

      return response.data.data; // Assuming the data is in response.data.data
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();

      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getRoleById = createAsyncThunk('Role/getRoleById', async (_, thunkAPI) => {
  try {
    const response = await RoleManagementsService.getRoleById();
    return response.data.data.roleCategories; // Assuming the data is in response.data.data
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();

    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateRoleList = createAsyncThunk(
  'Role/updateRoleList',
  async (permissions, thunkAPI) => {
    try {
      const response = await RoleManagementsService.updateRoleList(permissions);
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

// Slice definition
const RoleSlice = createSlice({
  name: 'Role',
  initialState: {
    RoleList: [],
    RoleListSide: [],
    RoleListById: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRoleListSide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoleListSide.fulfilled, (state, action) => {
        state.loading = false;
        state.RoleListSide = action.payload;
      })
      .addCase(getRoleListSide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.RoleListSide = [];
      })

      .addCase(getRoleList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoleList.fulfilled, (state, action) => {
        state.loading = false;
        state.RoleList = action.payload;
      })
      .addCase(getRoleList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.RoleList = [];
      })

      .addCase(getRoleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoleById.fulfilled, (state, action) => {
        
        state.loading = false;
        state.RoleListById = action.payload;
      })
      .addCase(getRoleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.RoleListById = [];
      })
      .addCase(updateRoleList.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateRoleList.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateRoleList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export default RoleSlice.reducer;
