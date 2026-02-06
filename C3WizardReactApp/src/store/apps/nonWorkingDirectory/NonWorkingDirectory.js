import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from '../message/MessageSlice';
import NonWorkingDirectory from '../../../service/nonWorkingDirectory/NonWorkingDirectory';

export const getNwDirectorPayroll = createAsyncThunk(
  'Employee/getNwDirectorPayroll',
  async (CompanyId, thunkAPI) => {
    try {
      const response = await NonWorkingDirectory.getNwDirectorPayroll(CompanyId); // Assuming this fetches all staff
      return { PayrollData: response.data.data.data1 }; // response.data should be the staff array
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

export const getNWDirector = createAsyncThunk(
  'Employee/getNWDirector',
  async (payload, thunkAPI) => {
    try {
      const response = await NonWorkingDirectory.getNWDirector(payload); // Assuming this fetches all staff
      thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return { EmployeeNWList: response.data.data }; // response.data should be the staff array
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

export const getNWDirectorNew = createAsyncThunk(
  'Employee/getNWDirectorNew',
  async (payload, thunkAPI) => {
    try {
      const response = await NonWorkingDirectory.getNWDirectorNew(payload); // Assuming this fetches all staff
      thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return { EmployeeNWListNew: response.data.data }; // response.data should be the staff array
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

export const directorImport = createAsyncThunk(
  'SelfEmployee/directorImport',
  async (params, thunkAPI) => {
    try {
      const response = await NonWorkingDirectory.directorImport(params);
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

export const ImportSubmitted = createAsyncThunk(
  'SelfEmployee/ImportSubmitted',
  async (params, thunkAPI) => {
    try {
      const response = await NonWorkingDirectory.ImportSubmitted(params);
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

export const ImportSubmittedLatest = createAsyncThunk(
  'SelfEmployee/ImportSubmittedLatest',
  async (params, thunkAPI) => {
    try {
      const response = await NonWorkingDirectory.ImportSubmittedLatest(params);
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

export const getC3generation = createAsyncThunk(
  'Employee/getC3generation',
  async (data, thunkAPI) => {
    try {
      const response = await NonWorkingDirectory.getC3generation(data); // Assuming this fetches all staff
      return {
        C3GenerationData: response.data.data.data,
        msg: response.data.msg,
        isNilReturn: response.data.data.isNilReturn,
      }; // response.data should be the staff array
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

export const getC3generationNill = createAsyncThunk(
  'Employee/getC3generationNill',
  async (data, thunkAPI) => {
    try {
      const response = await NonWorkingDirectory.getC3generationNill(data); // Assuming this fetches all staff
      return { C3GenerationData: response.data.data.data, msg: response.data.msg }; // response.data should be the staff array
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

export const PostNWSubmitC3Bulk = createAsyncThunk(
  'Employee/PostNWSubmitC3Bulk',
  async (data, thunkAPI) => {
    try {
      const response = await NonWorkingDirectory.PostNWSubmitC3Bulk(data);
      thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return { NWSubmitC3BulkData: response.data.data };
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

export const saveC3generation = createAsyncThunk(
  'auth/saveC3generation',
  async ({ dataSave }, thunkAPI) => {
    try {
      const response = await NonWorkingDirectory.saveC3generation({ dataSave });
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

export const ViewPayrollDirector = createAsyncThunk(
  'Employee/ViewPayrollDirector',
  async ({ headerID, CompanyId, monthno, Year, popUpList, isNilReturn }, thunkAPI) => {
    try {
      const response = await NonWorkingDirectory.ViewPayrollDirector({
        headerID,
        CompanyId,
        monthno,
        Year,
        popUpList,
        isNilReturn,
      }); // Assuming this fetches all staff
      return { EditPayrollData: response.data.data }; // response.data should be the staff array
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

export const PreviewPayroll = createAsyncThunk(
  'Employee/PreviewPayroll',
  async ({ headerID, CompanyId }, thunkAPI) => {
    try {
      const response = await NonWorkingDirectory.PreviewPayroll({ headerID, CompanyId }); // Assuming this fetches all staff
      return { PerPayrollData: response.data.data.dataEdit }; // response.data should be the staff array
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

export const editPayrollDirector = createAsyncThunk(
  'auth/editPayrollDirector',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await NonWorkingDirectory.editPayrollDirector({ payload });
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

export const getWorkingDirector = createAsyncThunk(
  'Employee/getWorkingDirector',
  async ({ CompanyId }, thunkAPI) => {
    try {
      const response = await NonWorkingDirectory.getWorkingDirector({ CompanyId }); // Assuming this
      // thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return { nwWorkingData: response.data.data }; // response.data should be the staff array
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

export const addNonDirector = createAsyncThunk(
  'Employee/addNonDirector',
  async ({ formData }, thunkAPI) => {
    try {
      const response = await NonWorkingDirectory.addNonDirector({ formData });
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

export const deleteNonDirector = createAsyncThunk(
  'Employee/deleteNonDirector',
  async (employeeId, thunkAPI) => {
    try {
      const response = await NonWorkingDirectory.deleteNonDirector(employeeId);
      thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return { deleteNonDirectory: response.data };
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

export const deleteNonDirectorPayroll = createAsyncThunk(
  'Employee/deleteNonDirectorPayroll',
  async (headerID, thunkAPI) => {
    try {
      const response = await NonWorkingDirectory.deleteNonDirectorPayroll(headerID);
      thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return { deleteNonDirectory: response.data };
    } catch (error) {
      const message =
        (error.response && error.response && error.response.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue();
    }
  },
);

export const getByIdNonWorkingDirectory = createAsyncThunk(
  'Employee/getByIdNonWorkingDirectory',
  async ({ employeeID }, thunkAPI) => {
    try {
      const response = await NonWorkingDirectory.getByIdNonWorkingDirectory({ employeeID }); // Assuming this fetches all staff
      return { getDataByID: response.data }; // response.data should be the staff array
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

export const editNonWorkingDirector = createAsyncThunk(
  'CGeneration/editNonWorkingDirector',
  async ({ formData }, thunkAPI) => {
    try {
      const response = await NonWorkingDirectory.editNonWorkingDirector({ formData });
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

export const PreviewPost = createAsyncThunk('CGeneration/PreviewPost', async (data, thunkAPI) => {
  try {
    const response = await NonWorkingDirectory.previewApi(data); // Assuming this fetches all staff
    return { previewResponse: response.data }; // response.data should be the staff array
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});

export const getContribution = createAsyncThunk(
  'Dashboard/getContribution',
  async (data, thunkAPI) => {
    try {
      const response = await NonWorkingDirectory.getContribution(data);
      return { ContributionCount: response.data.data };
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

export const PreviewDirectorc3 = createAsyncThunk(
  'Employee/PreviewDirectorc3',
  async (data, thunkAPI) => {
    console.log('PreviewDirectorc3 slice load', data);
    try {
      const response = await NonWorkingDirectory.PreviewDirectorc3(data); // Assuming this fetches all staff
      // thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      if (response.data.message !== 'Result.') {
        thunkAPI.dispatch(
          setMessage({
            message: response.data.message,
            type: 'success',
          }),
        );
      }

      return { PreviewDirectorc3Data: response.data }; // response.data should be the staff array
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const GetNwCheckC3Created = createAsyncThunk(
  'Employee/GetNwCheckC3Created',
  async (data, thunkAPI) => {
    try {
      const response = await NonWorkingDirectory.GetNwCheckC3Created(data);
      // thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return { NwCheckC3CreatedData: response.data };
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

export const OverwritingNWdirector = createAsyncThunk(
  'Employee/OverwritingNWdirector',
  async (payload, thunkAPI) => {
    try {
      const response = await NonWorkingDirectory.OverwritingNWdirector(payload);
      thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return { NwCheckC3CreatedData: response.data.message };
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

export const ImportC3Data = createAsyncThunk(
  'CGeneration/ImportC3Data',
  async (formData, thunkAPI) => {
    try {
      const response = await NonWorkingDirectory.ImportC3Data(formData);
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

export const UpdateExceptionRow = createAsyncThunk(
  'CGeneration/UpdateExceptionRow',
  async ({ userId, companyId, row }, thunkAPI) => {
    try {
      const response = await NonWorkingDirectory.UpdateExceptionRow(userId, companyId, row); 
      
      return { UpdateExceptionRowResponse: response.data }; 
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

const NonWorkingDirectorySlice = createSlice({
  name: 'Employee',
  initialState: {
    PayrollData: [],
    C3GenerationData: [],
    NWSubmitC3BulkData: [],
    NwCheckC3CreatedData: [],
    nwWorkingData: [],
    EditPayrollData: [],
    getDataByID: [],
    previewData: [],
    ContributionCount: [],
    EmployeeNWList: [],
    EmployeeNWListNew: [],
    PerPayrollData: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearContributionCount: (state) => {
      state.ContributionCount = [];
    },
    clearEmployeeNWList: (state) => {
      state.EmployeeNWList = [];
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(getNwDirectorPayroll.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNwDirectorPayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.PayrollData = action.payload.PayrollData;
      })
      .addCase(getNwDirectorPayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.PayrollData = [];
      })

      .addCase(getC3generation.pending, (state) => {
        state.loading = true;
      })
      .addCase(getC3generation.fulfilled, (state, action) => {
        state.loading = false;
        state.C3GenerationData = action.payload.C3GenerationData.map((x) => ({
          ...x,
          wageS1: (+x.wageS1).toFixed(2),
          wageS2: (+x.wageS2).toFixed(2),
          wageS3: (+x.wageS3).toFixed(2),
          wageS4: (+x.wageS4).toFixed(2),
          wageS5: (+x.wageS5).toFixed(2),
        }));
      })
      .addCase(getC3generation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.C3GenerationData = [];
      })

      .addCase(getC3generationNill.pending, (state) => {
        state.loading = true;
      })
      .addCase(getC3generationNill.fulfilled, (state, action) => {
        state.loading = false;
        state.C3GenerationData = action.payload.C3GenerationData.map((x) => ({
          ...x,
          wageS1: (+x.wageS1).toFixed(2),
          wageS2: (+x.wageS2).toFixed(2),
          wageS3: (+x.wageS3).toFixed(2),
          wageS4: (+x.wageS4).toFixed(2),
          wageS5: (+x.wageS5).toFixed(2),
        }));
      })
      .addCase(getC3generationNill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.C3GenerationData = [];
      })

      .addCase(PostNWSubmitC3Bulk.pending, (state) => {
        state.loading = true;
      })
      .addCase(PostNWSubmitC3Bulk.fulfilled, (state, action) => {
        state.loading = false;
        state.NWSubmitC3BulkData = action.payload.NWSubmitC3BulkData;
      })
      .addCase(PostNWSubmitC3Bulk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.NWSubmitC3BulkData = [];
      })

      .addCase(saveC3generation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(saveC3generation.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(saveC3generation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(ViewPayrollDirector.pending, (state) => {
        state.loading = true;
      })
      .addCase(ViewPayrollDirector.fulfilled, (state, action) => {
        state.loading = false;
        state.EditPayrollData = action.payload.EditPayrollData;
      })
      .addCase(ViewPayrollDirector.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.EditPayrollData = [];
      })

      .addCase(editPayrollDirector.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(editPayrollDirector.fulfilled, (state, action) => {
        state.loading = false;
        state.EditPayrollData = action.payload.EditPayrollData;
        state.error = null;
      })
      .addCase(editPayrollDirector.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(getWorkingDirector.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWorkingDirector.fulfilled, (state, action) => {
        state.loading = false;
        state.nwWorkingData = action.payload.nwWorkingData;
      })
      .addCase(getWorkingDirector.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.nwWorkingData = [];
      })

      .addCase(addNonDirector.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addNonDirector.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(addNonDirector.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(getByIdNonWorkingDirectory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getByIdNonWorkingDirectory.fulfilled, (state, action) => {
        state.loading = false;
        state.getDataByID = action.payload.getDataByID;
      })
      .addCase(getByIdNonWorkingDirectory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.getDataByID = [];
      })

      .addCase(editNonWorkingDirector.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(editNonWorkingDirector.fulfilled, (state, action) => {
        state.loading = false;
        state.getDataByID = action.payload.getDataByID;
        state.error = null;
      })
      .addCase(editNonWorkingDirector.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(deleteNonDirector.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteNonDirector.fulfilled, (state, action) => {
        state.loading = false;
        state.getDataByID = action.payload.getDataByID;
      })
      .addCase(deleteNonDirector.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.getDataByID = [];
      })

      .addCase(deleteNonDirectorPayroll.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteNonDirectorPayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.PayrollData = action.payload.PayrollData;
      })
      .addCase(deleteNonDirectorPayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.PayrollData = [];
      })

      .addCase(PreviewPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(PreviewPost.fulfilled, (state, action) => {
        //
        state.loading = false;
        state.previewData = action.payload.previewResponse;
      })
      .addCase(PreviewPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.previewData = [];
      })

      .addCase(getContribution.pending, (state) => {
        state.loading = true;
      })
      .addCase(getContribution.fulfilled, (state, action) => {
        state.loading = false;
        state.ContributionCount = action.payload.ContributionCount;
      })
      .addCase(getContribution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.ContributionCount = [];
      })

      .addCase(PreviewPayroll.pending, (state) => {
        state.loading = true;
      })
      .addCase(PreviewPayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.PerPayrollData = action.payload.PerPayrollData;
      })
      .addCase(PreviewPayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.PerPayrollData = [];
      })

      .addCase(PreviewDirectorc3.pending, (state) => {
        state.loading = true;
      })
      .addCase(PreviewDirectorc3.fulfilled, (state, action) => {
        state.loading = false;
        state.PreviewDirectorc3 = action.payload.PreviewDirectorc3Data;
      })
      .addCase(PreviewDirectorc3.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.PreviewDirectorc3 = [];
      })

      .addCase(directorImport.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(directorImport.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })

      .addCase(directorImport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(ImportSubmitted.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(ImportSubmitted.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })

      .addCase(ImportSubmitted.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(ImportSubmittedLatest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(ImportSubmittedLatest.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })

      .addCase(ImportSubmittedLatest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(OverwritingNWdirector.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(OverwritingNWdirector.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(OverwritingNWdirector.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(GetNwCheckC3Created.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetNwCheckC3Created.fulfilled, (state, action) => {
        state.loading = false;
        state.NwCheckC3CreatedData = action.payload.NwCheckC3CreatedData;
      })
      .addCase(GetNwCheckC3Created.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.NwCheckC3CreatedData = [];
      })

      .addCase(getNWDirector.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNWDirector.fulfilled, (state, action) => {
        state.loading = false;

        state.EmployeeNWList = action.payload.EmployeeNWList || [];
      })
      .addCase(getNWDirector.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.EmployeeList = [];
      })

      .addCase(getNWDirectorNew.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNWDirectorNew.fulfilled, (state, action) => {
        state.loading = false;

        state.EmployeeNWListNew = action.payload.EmployeeNWListNew || [];
      })
      .addCase(getNWDirectorNew.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.EmployeeList = [];
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
      });
  },
});

export const { clearContributionCount, clearEmployeeNWList } = NonWorkingDirectorySlice.actions;

export default NonWorkingDirectorySlice.reducer;
