import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from '../message/MessageSlice';
import UserManagementServices from '../../../service/user-management/UserManagementServices';

export const getLoadUsersList = createAsyncThunk(
  'Administration/LoadUsers',
  async ({ companyId, UserId, roleId }, thunkAPI) => {
    const isAdmin = roleId === '1' || roleId === '2';
    try {
      const response = await UserManagementServices.getLoadUsers(
        isAdmin ? 0 : companyId,
        roleId,
        UserId,
      );
      return { usersList: response.data.data };
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

export const getLoadUsersListFromCompany = createAsyncThunk(
  'Administration/LoadUsers',
  async ({ CompanyId, roleId, userId }, thunkAPI) => {
    //  const roleId = localStorage.getItem("roleId")

    try {
      const response = await UserManagementServices.getLoadUsers(CompanyId, roleId, userId);
      return { CompanyUsersList: response.data.data };
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

export const getLoadSelfEmployList = createAsyncThunk(
  'Administration/LoadUsers',
  async ({ pageNumber, pageSize, firstName, sortConfig }, thunkAPI) => {
    try {
      const response = await UserManagementServices.getAllSelfEmployer(
        pageNumber,
        pageSize,
        firstName,
        sortConfig,
      );
      return { selfUsersList: response.data.data };
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

export const getLoadSelfEmployListData = createAsyncThunk(
  'Administration/LoadUsers',
  async (_, thunkAPI) => {
    try {
      const response = await UserManagementServices.getAllSelfEmployerData();
      return { selfUsersList: response.data.data };
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

export const resetUserData = createAsyncThunk('auth/resetUserData', async (userId, thunkAPI) => {
  try {
    const response = await UserManagementServices.resetUserData(userId);
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
});

export const getAllCompanyList = createAsyncThunk(
  'Administration/getAllCompanyList',
  async ({ pageNumber, pageSize, firstName, sortConfig }, thunkAPI) => {
    try {
      const response = await UserManagementServices.getAllCompany(
        pageNumber,
        pageSize,
        firstName,
        sortConfig,
      );
      return { companyList: response.data.data };
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

export const UserUpdateStatus = createAsyncThunk(
  'Administration/UserUpdateStatus',
  async ({ userId, RoleId }, thunkAPI) => {
    try {
      const response = await UserManagementServices.UserUpdateStatus(userId, RoleId);
      thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return response.data;
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

const AdministrationSlice = createSlice({
  name: 'Administration',
  initialState: {
    usersList: [],
    CompanyUsersList: [],
    selfUsersList: [],
    companyList: [],

    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder

      .addCase(getLoadUsersList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLoadUsersList.fulfilled, (state, action) => {
        state.loading = false;
        state.usersList = action.payload.usersList;
        state.CompanyUsersList = action.payload.CompanyUsersList;
        state.selfUsersList = action.payload.selfUsersList;
      })
      .addCase(getLoadUsersList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.usersList = [];
        state.CompanyUsersList = [];
        state.selfUsersList = [];
      })

      .addCase(getAllCompanyList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCompanyList.fulfilled, (state, action) => {
        state.loading = false;
        state.companyList = action.payload.companyList.records;
      })
      .addCase(getAllCompanyList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.companyList = [];
      })

      .addCase(resetUserData.pending, (state) => {
        state.loadingModal = true;
        state.error = null;
        state.success = false;
      })
      .addCase(resetUserData.fulfilled, (state) => {
        state.loadingModal = false;
        state.success = true;
      })
      .addCase(resetUserData.rejected, (state, action) => {
        state.loadingModal = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(UserUpdateStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UserUpdateStatus.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(UserUpdateStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export default AdministrationSlice.reducer;
