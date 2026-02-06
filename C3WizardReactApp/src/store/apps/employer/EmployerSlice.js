import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from '../message/MessageSlice';
import EmployerService from '../../../service/employer/Employer';

// export const getEmployerList = createAsyncThunk(
//   'Employee/getEmployerList',
//   async (companyId, thunkAPI) => {
//     ;
//     try {
//       const response = await EmployerService.getEmployerList(companyId);
//       return { EmployeeList: response.data.data };
//     } catch (error) {
//       const message =
//         (error.response && error.response.data && error.response.data.message) ||
//         error.message ||
//         error.toString();
//       thunkAPI.dispatch(setMessage(message));
//       return thunkAPI.rejectWithValue();
//     }
//   },
// );

export const getEmployerList = createAsyncThunk(
  'Employee/getEmployerList',
  async ({ companyId, roleId }, thunkAPI) => {
    try {
      const response = await EmployerService.getEmployerList(companyId, roleId);
      return { EmployeeList: response.data.data };
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

// export const postEmployer = createAsyncThunk(
//   'Employee/postEmployer',
//   async (formData, thunkAPI) => {

//     try { debugger
//       const response = await EmployerService.postEmployer(formData);
//       thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
//       return response.data.data;
//     } catch (error) {
//       const message =
//         (error.response && error.response && error.response.data.message) ||
//         error.message ||
//         error.toString();
//       thunkAPI.dispatch(setMessage({ message, type: 'error' }));
//       return thunkAPI.rejectWithValue(message);
//     }
//   },
// );

export const postEmployer = createAsyncThunk(
  'Employee/postEmployer',
  async (formData, thunkAPI) => {
    try {
      const response = await EmployerService.postEmployer(formData);
      thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // If the status code is 409, reject silently without showing an error message
        return thunkAPI.rejectWithValue('User email already exists');
      }
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const EmployersGetById = createAsyncThunk(
  'Employee/EmployersGetById',
  async ({ companyId, UserId }, thunkAPI) => {
    try {
      const response = await EmployerService.EmployersGetById(companyId, UserId); // Assuming this fetches all staff
      return { EmployersGetBydata: response.data.data }; // response.data should be the staff array
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

export const EmployersGetByHeader = createAsyncThunk(
  'Employee/EmployersGetByHeader',
  async ({ companyId, UserId }, thunkAPI) => {
    
    try {
      const response = await EmployerService.EmployersGetByHeader(companyId, UserId); // Assuming this fetches all staff
      return { EmployersHeader: response.data.data }; // response.data should be the staff array
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

const EmployerSlice = createSlice({
  name: 'Employee',
  initialState: {
    EmployeeList: [],
    EmployersGetBydata: [],
    EmployersHeader: [],
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder

      .addCase(getEmployerList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEmployerList.fulfilled, (state, action) => {
        state.loading = false;
        state.EmployeeList = action.payload.EmployeeList;
      })
      .addCase(getEmployerList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.EmployeeList = [];
      })
      .addCase(EmployersGetById.pending, (state) => {
        state.loading = true;
      })
      .addCase(EmployersGetById.fulfilled, (state, action) => {
        state.loading = false;
        state.EmployersGetBydata = action.payload.EmployersGetBydata;
      })
      .addCase(EmployersGetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.EmployersGetBydata = [];
      })
      .addCase(EmployersGetByHeader.pending, (state) => {
        state.loading = true;
      })
      .addCase(EmployersGetByHeader.fulfilled, (state, action) => {
        state.loading = false;
        state.EmployersHeader = action.payload.EmployersHeader;
      })
      .addCase(EmployersGetByHeader.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.EmployersHeader = [];
      })
      .addCase(postEmployer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(postEmployer.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Update companyLogo only if EmployersGetBydata exists

        state.EmployersGetBydata.companyLogo = action.payload.companyLogo;

        state.error = null;
      })
      .addCase(postEmployer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export default EmployerSlice.reducer;
