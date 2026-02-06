import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from '../../message/MessageSlice';
import SelfEmployeeService from '../../../../service/selfEmployee/selfEmployeeContibution/SelfEmployeeContibutionService';

export const getSelfEmployee = createAsyncThunk(
  'SelfEmployee/getSelfEmployee',
  async ({ companyId }, thunkAPI) => {
    
    try {
      const response = await SelfEmployeeService.getSelfEmployee({ companyId });
      return { SelfEmployeeData: response.data.data };
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

export const ExportCThree = createAsyncThunk(
  'SelfEmployee/ExportCThree',
  async (params, thunkAPI) => {
    
    try {
      const response = await SelfEmployeeService.ExportCThree(params);
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

export const EXportSubmit = createAsyncThunk(
  'SelfEmployee/EXportSubmit',
  async (params, thunkAPI) => {
    
    try {
      const response = await SelfEmployeeService.EXportSubmit(params);
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



export const ExportCThreeData = createAsyncThunk(
  'SelfEmployee/ExportCThreeData',
  async (exportItems, thunkAPI) => {
    
    try {
      // const response = await SelfEmployeeService.ExportCThreeData(params);
      const { headerId, month, year } = exportItems.exportItems;
      const response = await SelfEmployeeService.ExportCThreeData(headerId, month, year);
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

export const exportCreatedCThree = createAsyncThunk(
  'SelfEmployee/exportCreatedCThree',
  async (params, thunkAPI) => {
    
    try {
      const response = await SelfEmployeeService.exportCreatedCThree(params);
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

export const addSelfEmployee = createAsyncThunk(
  'SelfEmployee/addSelfEmployee',
  async ({ formData }, thunkAPI) => {
    try {
      const response = await SelfEmployeeService.addSelfEmployee({ formData });
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

export const deleteSelfEmployee = createAsyncThunk(
  'SelfEmployee/deleteSelfEmployee',
  async (headerId, thunkAPI) => {
    
    try {
      const response = await SelfEmployeeService.deleteSelfEmployee(headerId);
      thunkAPI.dispatch(setMessage({ message: response.data.msg, type: 'success' }));
      return { deleteNonDirectory: response.data };
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

export const createSelfContribution = createAsyncThunk(
  'SelfEmployee/createSelfContribution',
  async ({ formData }, thunkAPI) => {
    
    try {
      const response = await SelfEmployeeService.createSelfContribution({ formData });
      // thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return { SelfContributionList: response.data.data };
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

export const createSelfContributionNew = createAsyncThunk(
  'SelfEmployee/createSelfContributionNew',
  async ({ formDatas }, thunkAPI) => {
    
    try {
      const response = await SelfEmployeeService.createSelfContributionNew({ formDatas });
      // thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return { SelfContributionList: response.data.data };
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

export const isCreatedCThree = createAsyncThunk(
  'SelfEmployee/isCreatedCThree',
  async ({ createdNewItems }, thunkAPI) => {
    
    try {
      const response = await SelfEmployeeService.isCreatedCThree({ createdNewItems });
      thunkAPI.dispatch(setMessage({ message: response.data.msg, type: 'success' }));
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

export const saveSelfContribution = createAsyncThunk(
  'SelfEmployee/saveSelfContribution',
  async ({ data }, thunkAPI) => {
    
    try {
      const response = await SelfEmployeeService.saveSelfContribution({ data });
      // thunkAPI.dispatch(setMessage({ message: response.data.msg, type: 'success' }));
      if (response.data.msg !== 'openPopUp') {
        thunkAPI.dispatch(setMessage({ message: response.data.msg, type: 'success' }));
      }
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

export const saveSelfContributionPreview = createAsyncThunk(
  'SelfEmployee/saveSelfContributionPreview',
  async ({ data }, thunkAPI) => {
    
    try {
      const response = await SelfEmployeeService.saveSelfContributionPreview({ data });
      // thunkAPI.dispatch(setMessage({ message: response.data.msg, type: 'success' }));
      // if (response.data.msg !== "openPopUp") {
      //   thunkAPI.dispatch(setMessage({ message: response.data.msg, type: 'success' }));
      // }
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

export const updateOnChange = createAsyncThunk(
  'SelfEmployee/updateOnChange',
  async ({ onChangeData }, thunkAPI) => {
    
    try {
      const response = await SelfEmployeeService.updateOnChange({ onChangeData });
      // thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response && error.response.data.message) ||
        error.message ||
        error.toString();
      // thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getList = createAsyncThunk(
  'SelfEmployee/getList',
  async ({ headerId, CompanyId }, thunkAPI) => {
    
    try {
      const response = await SelfEmployeeService.getList({ headerId, CompanyId });
      return { EditDataList: response.data.data };
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

export const updateSelfEmployee = createAsyncThunk(
  'SelfEmployee/updateSelfEmployee',
  async ({ formData }, thunkAPI) => {
    try {
      const response = await SelfEmployeeService.updateSelfEmployee({ formData });
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

const SelfEmployeeContributionSlice = createSlice({
  name: 'SelfEmployee',
  initialState: {
    SelfEmployeeData: [],
    SelfContributionList: [],
    EditDataList: [],
    loading: false,
    error: null,
  },

    reducers: {
    resetSelfEmployeeState: (state) => {
      // state.SelfEmployeeData = [];
      state.SelfContributionList = [];
      // state.EditDataList = [];
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(getSelfEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSelfEmployee.fulfilled, (state, action) => {
        
        state.loading = false;
        state.SelfEmployeeData = action.payload.SelfEmployeeData;
      })
      .addCase(getSelfEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.SelfEmployeeData = [];
      })

      .addCase(deleteSelfEmployee.pending, (state) => {
        
        state.loading = true;
      })
      .addCase(deleteSelfEmployee.fulfilled, (state, action) => {
        
        state.loading = false;
        state.deleteNonDirectory = action.payload.deleteNonDirectory;
      })
      .addCase(deleteSelfEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.deleteNonDirectory = [];
      })
      .addCase(addSelfEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addSelfEmployee.fulfilled, (state) => {
        
        state.loading = false;
        state.success = true;
        state.error = null;
      })

      .addCase(addSelfEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(ExportCThree.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(ExportCThree.fulfilled, (state) => {
        
        state.loading = false;
        state.success = true;
     
      })

      .addCase(ExportCThree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

        .addCase(EXportSubmit.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(EXportSubmit.fulfilled, (state, action) => {
        
        state.loading = false;
        state.success = true;
        // state.SelfEmployeeData = action.payload;
      })

      .addCase(EXportSubmit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      

      .addCase(ExportCThreeData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(ExportCThreeData.fulfilled, (state) => {
        
        state.loading = false;
        state.success = true;
        state.error = null;
      })

      .addCase(ExportCThreeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(exportCreatedCThree.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(exportCreatedCThree.fulfilled, (state) => {
        
        state.loading = false;
        state.success = true;
        state.error = null;
      })

      .addCase(exportCreatedCThree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(createSelfContribution.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSelfContribution.fulfilled, (state, action) => {
        
        state.loading = false;
        state.SelfContributionList = action.payload.SelfContributionList;
      })
      .addCase(createSelfContribution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.SelfContributionList = [];
      })

      .addCase(saveSelfContribution.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(saveSelfContribution.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(saveSelfContribution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(saveSelfContributionPreview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(saveSelfContributionPreview.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(saveSelfContributionPreview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(isCreatedCThree.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(isCreatedCThree.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(isCreatedCThree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(getList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getList.fulfilled, (state, action) => {
        
        state.loading = false;
        state.EditDataList = action.payload.EditDataList;
      })
      .addCase(getList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.EditDataList = [];
      })

      .addCase(updateSelfEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateSelfEmployee.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(updateSelfEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(updateOnChange.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateOnChange.fulfilled, (state, action) => {
        
        state.loading = false;
        state.success = true;
        state.error = null;
        state.SelfContributionList = action.payload.data;
      })
      .addCase(updateOnChange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetSelfEmployeeState } = SelfEmployeeContributionSlice.actions;

export default SelfEmployeeContributionSlice.reducer;
