import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from '../message/MessageSlice';
import EmployeeService from '../../../service/employee/Employee';

export const getEmployeeList = createAsyncThunk(
  'Employee/getEmployeeList',
  async (CompanyId, thunkAPI) => {
    try {
      const response = await EmployeeService.getEmployeeList(CompanyId); // Assuming this fetches all staff
      return { EmployeeList: response.data.data }; // response.data should be the staff array
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

export const getEmployeeSSN = createAsyncThunk(
  'Employee/getEmployeeSSN',
  async (payload, thunkAPI) => {
    try {
      const response = await EmployeeService.getEmployeeSSN(payload); // Assuming this fetches all staff
      thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return { EmployeeListSSN: response.data.data }; // response.data should be the staff array
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

export const getEmployeeSSNNew = createAsyncThunk(
  'Employee/getEmployeeSSNNew',
  async (payload, thunkAPI) => {
    try {
      const response = await EmployeeService.getEmployeeSSNNew(payload); // Assuming this fetches all staff
      thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return { EmployeeListSSNNew: response.data.data }; // response.data should be the staff array
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

export const addEmployee = createAsyncThunk('Employee/addEmployee', async (data, thunkAPI) => {
  try {
    const response = await EmployeeService.addEmployee(data); // Assuming this fetches all staff
    thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
    return { addEmployeeResponse: response.data }; // response.data should be the staff array
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage({ message, type: 'error' }));
    return thunkAPI.rejectWithValue();
  }
});

export const deleteEmployee = createAsyncThunk(
  'Employee/deleteEmployee',
  async (employeeId, thunkAPI) => {
    try {
      const response = await EmployeeService.deleteEmployee(employeeId); // Assuming this fetches all staff
      thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return { deleteEmpResponse: response.data.data }; // response.data should be the staff array
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

export const editEmployeeList = createAsyncThunk(
  'Employee/editEmployeeList',
  async (data, thunkAPI) => {
    try {
      const response = await EmployeeService.editEmployeeList(data); // Assuming this fetches all staff
      return { editEmployeeListResponse: response.data.data }; // response.data should be the staff array
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

export const viewDirectorWages = createAsyncThunk(
  'Employee/viewDirectorWages',
  async (data, thunkAPI) => {
    console.log('viewDirectorWages', data);
    try {
      const response = await EmployeeService.AddDirectorWagesHolidayPay(data); // Assuming this fetches
      thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));

      return { viewDirectorWagesResponse: response.data.data }; // response.data should be the staff array
    } catch (error) {
      const message =
        (error.response && error.response.data.message && error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue();
    }
  },
);

export const getViewDirectorWages = createAsyncThunk(
  'Employee/getViewDirectorWages',
  async (data, thunkAPI) => {
    try {
      const response = await EmployeeService.GetHolidayPayByEmployee(data); // Assuming this fetches all staff
      return { getViewDirectorWagesResponse: response.data.data }; // response.data should be the staff array
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

export const employeeImport = createAsyncThunk(
  'Employee/employeeImport',
  async (params, thunkAPI) => {
    try {
      const response = await EmployeeService.employeeImport(params);
      thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data.message) || error.message || error.toString();
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const EmployeeSlice = createSlice({
  name: 'Employee',
  initialState: {
    EmployeeList: [],
    addEmployeeR: [],
    DirectorWages: [],
    ViewDirectorWages: [],
    delete: [],
    editList: [],
    EmployeeListSSN: [],
    EmployeeListSSNNew:[],
    loading: false,
    error: null,
  },

  reducers: {
    clearContributionCount: (state) => {
      state.EmployeeList = [];
    },
    // Add this reducer to clear EmployeeNWList:
    clearEmployeeNWList: (state) => {
      state.EmployeeListSSN = [];
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(getEmployeeList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEmployeeList.fulfilled, (state, action) => {
        state.loading = false;
        // state.EmployeeList = action.payload.EmployeeList;
        state.EmployeeList = action.payload.EmployeeList || [];
      })
      .addCase(getEmployeeList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.EmployeeList = [];
      })

      .addCase(getEmployeeSSN.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEmployeeSSN.fulfilled, (state, action) => {
        state.loading = false;

        state.EmployeeListSSN = action.payload.EmployeeListSSN || [];
      })
      .addCase(getEmployeeSSN.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.EmployeeList = [];
      })

      .addCase(getEmployeeSSNNew.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEmployeeSSNNew.fulfilled, (state, action) => {
        state.loading = false;

        state.EmployeeListSSNNew = action.payload.EmployeeListSSNew || [];
      })
      .addCase(getEmployeeSSNNew.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.EmployeeList = [];
      })

      .addCase(addEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.addEmployeeR = action.payload.addEmployeeResponse;
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.addEmployeeR = [];
      })

      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.delete = action.payload.deleteEmpResponse;
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.delete = [];
      })

      .addCase(editEmployeeList.pending, (state) => {
        state.loading = true;
      })
      .addCase(editEmployeeList.fulfilled, (state, action) => {
        state.loading = false;
        state.editList = action.payload.editEmployeeListResponse;
      })
      .addCase(editEmployeeList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.editList = [];
      })

      .addCase(viewDirectorWages.pending, (state) => {
        state.loading = true;
      })
      .addCase(viewDirectorWages.fulfilled, (state, action) => {
        console.log('action', action);
        state.loading = false;
        state.DirectorWages = action.payload.viewDirectorWagesResponse;
      })
      .addCase(viewDirectorWages.rejected, (state, action) => {
        console.log('action', action);
        state.loading = false;
        state.error = action.error.message;
        state.DirectorWages = [];
      })

      .addCase(getViewDirectorWages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getViewDirectorWages.fulfilled, (state, action) => {
        state.loading = false;
        state.ViewDirectorWages = action.payload.getViewDirectorWagesResponse;
      })
      .addCase(getViewDirectorWages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.ViewDirectorWages = [];
      })
      .addCase(employeeImport.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(employeeImport.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })

      .addCase(employeeImport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const {
  clearEmployeeNWList, // ← add this
} = EmployeeSlice.actions;

export default EmployeeSlice.reducer;
