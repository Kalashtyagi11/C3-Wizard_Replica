import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from '../message/MessageSlice';
import CGenerationService from '../../../service/cGeneration/CGeneration';

export const getCGeneration = createAsyncThunk(
  'CGeneration/getCGeneration',
  async (CompanyId, thunkAPI) => {
    try {
      const response = await CGenerationService.getCGeneration(CompanyId); // Assuming this fetches all staff
      return { GenerationList: response.data.data }; // response.data should be the staff array
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

export const loadEmployee = createAsyncThunk('CGeneration/loadEmployee', async (data, thunkAPI) => {
  try {
    const response = await CGenerationService.loadEmployee(data); // Assuming this fetches all staff
    return {
      loadEmployee: response.data.data,
      msg: response.data.msg,
      isNilReturn: response.data.isNilReturn,
    }; // response.data should be the staff array
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});

export const loadEmployeeNill = createAsyncThunk(
  'CGeneration/loadEmployeeNill',
  async (data, thunkAPI) => {
    try {
      const response = await CGenerationService.loadEmployeeNill(data); // Assuming this fetches all staff
      return { loadEmployeeNill: response.data.data, msg: response.data.msg }; // response.data should be the staff array
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

export const PreviewPost = createAsyncThunk('CGeneration/PreviewPost', async (data, thunkAPI) => {
  try {
    const response = await CGenerationService.previewApi(data); // Assuming this fetches all staff
    //thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
    if (
      response.data.message !== 'Result.' &&
      response.data.message !== 'Please select atleast one employee.'
    ) {
      thunkAPI.dispatch(
        setMessage({
          message: response.data.message,
          type: 'success',
        }),
      );
    }
    return { previewResponse: response.data }; // response.data should be the staff array
  } catch (error) {
    
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage({ message, type: 'error' }));
    return thunkAPI.rejectWithValue(message);
  }
});

export const editC3EmployeeListing = createAsyncThunk(
  'CGeneration/editC3EmployeeListing',
  async (data, thunkAPI) => {
    try {
      const response = await CGenerationService.editC3EmployeeListingApi(data); // Assuming this fetches all staff
      return { editC3EmployeeResponse: response.data.data }; // response.data should be the staff array
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

export const deletetCGeneration = createAsyncThunk(
  'CGeneration/deletetCGeneration',
  async (headerId, thunkAPI) => {
    try {
      const response = await CGenerationService.deleteCGeneration(headerId); // Assuming this fetches
      thunkAPI.dispatch(setMessage({ message: response.message, type: 'success' }));
      return { c3DeleteResponse: response.data }; // response.data should be the staff array
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

export const submitC3 = createAsyncThunk('CGeneration/submitC3', async (data, thunkAPI) => {
  try {
    const response = await CGenerationService.submitC3(data); // Assuming this fetches all staff

    if (!response.data.status) {
      const errorMessage = response.data.message || 'Something went wrong!';
      thunkAPI.dispatch(setMessage({ message: errorMessage, type: 'error' }));
      return thunkAPI.rejectWithValue(errorMessage);
    }
    thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
    return { submitC3Response: response.data }; // response.data should be the staff array
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});

export const checkC3Created = createAsyncThunk(
  'CGeneration/checkC3Created',
  async (data, thunkAPI) => {
    try {
      const response = await CGenerationService.checkC3Created(data); // Assuming this fetches all staff
      // thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return { checkC3CreatedResponse: response.data }; // response.data should be the staff array
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

export const addOrUpdateSaveNContinue = createAsyncThunk(
  'CGeneration/addOrUpdateSaveNContinue',
  async (data, thunkAPI) => {
    try {
      const response = await CGenerationService.addOrUpdateSaveNContinue(data); // Assuming this fetches all staff
      thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return { addOrUpdateSaveNContinueResponse: response.data }; // response.data should be the staff array
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

export const UpdateExceptionRow = createAsyncThunk(
  'CGeneration/UpdateExceptionRow',
  async ({ userId, companyId, row }, thunkAPI) => {
    try {
      const response = await CGenerationService.UpdateExceptionRow(userId, companyId, row); // Assuming
      // thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return { UpdateExceptionRowResponse: response.data }; // response.data should be the staff array
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const AddExceptionRow = createAsyncThunk(
  'CGeneration/AddExceptionRow',
  async ({ userId, companyId, row }, thunkAPI) => {
    try {
      const response = await CGenerationService.AddExceptionRow(userId, companyId, row); // Assuming
      // thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return { AddExceptionRowResponse: response.data }; // response.data should be the staff array
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const ImportC3Data = createAsyncThunk(
  'CGeneration/ImportC3Data',
  async (formData, thunkAPI) => {
    try {
      const response = await CGenerationService.ImportC3Data(formData);
      // thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return {
        uploadedDataResponse: response.data.data,
        message: response.data.message || response.data.msg,
      };
    } catch (error) {
      // const message = error.response?.data?.message || error.message || error.toString();
      // thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      const errorData = error.response?.data;
      let message = error.message || error.toString();

      // Check for "Invalid CSV headers." and customize output

      if (
        errorData?.message === 'Invalid CSV headers.' &&
        Array.isArray(errorData?.data?.invalidColumns)
      ) {
        message = `Invalid CSV headers: ${errorData.data.invalidColumns.join(', ')}`;
      } else if (errorData?.msg) {
        message = errorData.msg;
      }

      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue();
    }
  },
);

const CGenerationSlice = createSlice({
  name: 'CGeneration',
  initialState: {
    GenerationList: [],
    loadEmployeeList: [],
    editC3Employee: [],
    submitC3: [],
    ischeckC3Created: [],
    addUpdateSaveNContinue: [],
    previewData: [],
    c3Delete: [],
    loading: false,
    loadingings: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder

      .addCase(getCGeneration.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCGeneration.fulfilled, (state, action) => {
        //
        state.loading = false;
        state.GenerationList = action.payload.GenerationList;
      })
      .addCase(getCGeneration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.GenerationList = [];
      })

      .addCase(loadEmployee.pending, (state) => {
        state.loadingings = true;
      })
      .addCase(loadEmployee.fulfilled, (state, action) => {
        //
        state.loadingings = false;
        // state.loadEmployeeList = action.payload.loadEmployee;
        state.loadEmployeeList = action.payload.loadEmployee.map((x) => ({
          ...x,
          wageS1: (+x.wageS1).toFixed(2),
          wageS2: (+x.wageS2).toFixed(2),
          wageS3: (+x.wageS3).toFixed(2),
          wageS4: (+x.wageS4).toFixed(2),
          wageS5: (+x.wageS5).toFixed(2),
        }));
      })
      .addCase(loadEmployee.rejected, (state, action) => {
        state.loadingings = false;
        state.error = action.error.message;
        state.loadEmployeeList = [];
      })

      .addCase(loadEmployeeNill.pending, (state) => {
        state.loadingings = true;
      })
      .addCase(loadEmployeeNill.fulfilled, (state, action) => {
        //
        state.loadingings = false;
        // state.loadEmployeeList = action.payload.loadEmployee;
        state.loadEmployeeList = action.payload.loadEmployeeNill.map((x) => ({
          ...x,
          wageS1: (+x.wageS1).toFixed(2),
          wageS2: (+x.wageS2).toFixed(2),
          wageS3: (+x.wageS3).toFixed(2),
          wageS4: (+x.wageS4).toFixed(2),
          wageS5: (+x.wageS5).toFixed(2),
        }));
      })
      .addCase(loadEmployeeNill.rejected, (state, action) => {
        state.loadingings = false;
        state.error = action.error.message;
        state.loadEmployeeList = [];
      })

      .addCase(PreviewPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(PreviewPost.fulfilled, (state, action) => {
        state.loading = false;
        state.previewData = action.payload.previewResponse;
      })
      .addCase(PreviewPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.previewData = [];
      })

      .addCase(editC3EmployeeListing.pending, (state) => {
        state.loading = true;
      })
      .addCase(editC3EmployeeListing.fulfilled, (state, action) => {
        state.loading = false;
        state.editC3Employee = action.payload.editC3EmployeeResponse;
      })
      .addCase(editC3EmployeeListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.editC3Employee = [];
      })

      .addCase(deletetCGeneration.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletetCGeneration.fulfilled, (state, action) => {
        state.loading = false;
        state.c3Delete = action.payload.c3DeleteResponse;
      })
      .addCase(deletetCGeneration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.c3Delete = [];
      })

      .addCase(submitC3.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitC3.fulfilled, (state, action) => {
        state.loading = false;
        state.submitC3 = action.payload.submitC3Response;
      })
      .addCase(submitC3.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.submitC3 = [];
      })

      .addCase(checkC3Created.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkC3Created.fulfilled, (state, action) => {
        state.loading = false;
        state.ischeckC3Created = action.payload.checkC3CreatedResponse;
      })
      .addCase(checkC3Created.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.ischeckC3Created = [];
      })

      .addCase(addOrUpdateSaveNContinue.pending, (state) => {
        state.loading = true;
      })
      .addCase(addOrUpdateSaveNContinue.fulfilled, (state, action) => {
        state.loading = false;
        state.addUpdateSaveNContinue = action.payload.addOrUpdateSaveNContinueResponse;
        // state.previewData = action.allEmployeeList_List;
      })
      .addCase(addOrUpdateSaveNContinue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(UpdateExceptionRow.pending, (state) => {
        state.loading = true;
      })
      .addCase(UpdateExceptionRow.fulfilled, (state, action) => {
        state.loading = false;
        state.UpdateExceptionRow = action.payload.UpdateExceptionRowResponse;
      })
      .addCase(UpdateExceptionRow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.UpdateExceptionRow = [];
      })

      .addCase(AddExceptionRow.pending, (state) => {
        state.loading = true;
      })
      .addCase(AddExceptionRow.fulfilled, (state, action) => {
        state.loading = false;
        state.AddExceptionRow = action.payload.AddExceptionRowResponse;
      })
      .addCase(AddExceptionRow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.AddExceptionRow = [];
      })

      .addCase(ImportC3Data.pending, (state) => {
        state.loading = true;
      })
      .addCase(ImportC3Data.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadedData = action.payload.uploadedDataResponse;
      })
      .addCase(ImportC3Data.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default CGenerationSlice.reducer;
