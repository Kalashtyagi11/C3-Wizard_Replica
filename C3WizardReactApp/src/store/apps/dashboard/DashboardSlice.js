import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from '../message/MessageSlice';
import DashboardService from '../../../service/dashboard/Dashboard';

export const getContribution = createAsyncThunk(
  'Dashboard/getContribution',
  async (data, thunkAPI) => {
    try {
      const response = await DashboardService.getContribution(data);
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


export const getStatus = createAsyncThunk('Dashboard/getStatus', async (data, thunkAPI) => {
  try {
    const response = await DashboardService.getStatus(data);
    return { StatusData: response.data.data };
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});

export const getReconcilationUpdate = createAsyncThunk(
  'Dashboard/getReconcilationUpdate',
  async (id, thunkAPI) => {
    try {
      const response = await DashboardService.getReconcilationUpdate(id);
      return { updateRecord: response.data.data };
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

export const UpdateStatus = createAsyncThunk(
  'SelfEmployee/UpdateStatus',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await DashboardService.UpdateStatus(payload);
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

export const StatusChange = createAsyncThunk(
  'Dashboard/StatusChange',
  async (payload, thunkAPI) => {
    try {
      const response = await DashboardService.StatusChange(payload);
      thunkAPI.dispatch(setMessage({ message: response.data.msg, type: 'success' }));
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data.msg) || error.message || error.toString();
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const reconcilationUpdate = createAsyncThunk(
  'SelfEmployee/reconcilationUpdate',
  async (payload, thunkAPI) => {
    try {
      const response = await DashboardService.reconcilationUpdate(payload);
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

export const getContributionSingle = createAsyncThunk(
  'Dashboard/getContributionSingle',
  async (data, thunkAPI) => {
    try {
      const response = await DashboardService.getContributionSingle(data);
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

export const ColumnGet = createAsyncThunk('Dashboard/ColumnGet', async (UserId, thunkAPI) => {
  try {
    const response = await DashboardService.ColumnGet(UserId);
    return { ColumnData: response.data };
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});

export const ImportCThree = createAsyncThunk(
  'SelfEmployee/ImportCThree',
  async (params, thunkAPI) => {
    try {
      const response = await DashboardService.ImportCThree(params);
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

export const ReconcileData = createAsyncThunk(
  'SelfEmployee/ReconcileData',
  async (payload, thunkAPI) => {
    try {
      const response = await DashboardService.ReconcileData(payload);
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

export const CustomizeData = createAsyncThunk(
  'SelfEmployee/CustomizeData',
  async (payload, thunkAPI) => {
    try {
      const response = await DashboardService.CustomizeData(payload);
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

export const ImportCThreeLatest = createAsyncThunk(
  'SelfEmployee/ImportCThreeLatest',
  async (params, thunkAPI) => {
    try {
      const response = await DashboardService.ImportCThreeLatest(params);
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

export const dashboardSubmitDirector = createAsyncThunk(
  'SelfEmployee/dashboardSubmitDirector',
  async (params, thunkAPI) => {
    try {
      const response = await DashboardService.dashboardSubmitDirector(params);

      if (!response.data.status) {
        const errorMessage = response.data.message || 'Something went wrong!';
        thunkAPI.dispatch(setMessage({ message: errorMessage, type: 'error' }));
        return thunkAPI.rejectWithValue(errorMessage);
      }

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

export const dashboardSubmitContribution = createAsyncThunk(
  'SelfEmployee/dashboardSubmitContribution',
  async (params, thunkAPI) => {
    try {
      const response = await DashboardService.dashboardSubmitContribution(params);

      if (!response.data.status) {
        const errorMessage = response.data.message || 'Something went wrong!';
        thunkAPI.dispatch(setMessage({ message: errorMessage, type: 'error' }));
        return thunkAPI.rejectWithValue(errorMessage);
      }

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

export const getDirectorContribution = createAsyncThunk(
  'Dashboard/getDirectorContribution',
  async (CompanyId, thunkAPI) => {
    try {
      const response = await DashboardService.getDirectorContribution(CompanyId); // Assuming this fetches all staff
      return { DirectorContributionCount: response.data.data }; // response.data should be the staff array
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

export const getContributionList = createAsyncThunk(
  'Dashboard/getContributionList',
  async (CompanyId, thunkAPI) => {
    try {
      const response = await DashboardService.getContributionList(CompanyId); // Assuming this fetches all staff
      return { ContributionList: response.data.data }; // response.data should be the staff array
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

export const getDirectorContributionList = createAsyncThunk(
  'Dashboard/getDirectorContributionList',
  async (CompanyId, thunkAPI) => {
    try {
      const response = await DashboardService.getDirectorContributionList(CompanyId); // Assuming this fetches all staff
      return { DirectorContributionList: response.data.data }; // response.data should be the staff array
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

export const previewAllData = createAsyncThunk(
  'Dashboard/previewAllData',
  async ({ monthName, year, companyId, c3HeaderId }, thunkAPI) => {
    try {
      const response = await DashboardService.previewAllData({
        monthName,
        year,
        companyId,
        c3HeaderId,
      });
      console.log('Preeeeeeeeee', response.data);
      return { previewResponse: response.data };
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

export const previewNWData = createAsyncThunk(
  'Dashboard/previewNWData',
  async ({ monthId, year, companyId, c3HeaderId }, thunkAPI) => {
    try {
      const response = await DashboardService.previewNWData({
        monthId,
        year,
        companyId,
        c3HeaderId,
      });
      console.log('Preeeeeeeeee', response.data);
      return { previewNWResponse: response.data };
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

export const getCompanyDropdown = createAsyncThunk(
  'Dashboard/getCompanyDropdown',
  async (data, thunkAPI) => {
    try {
      const response = await DashboardService.getCompanyDropdown(data);
      return { CompanyDropdownResponse: response.data.data };
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

export const getCompanyDropdownUser = createAsyncThunk(
  'Dashboard/getCompanyDropdownUser',
  async (data, thunkAPI) => {
    try {
      const response = await DashboardService.getCompanyDropdownUser(data);
      return { CompanyDropdownRes: response.data.data };
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

export const getLoaddashboardPaymentStatus = createAsyncThunk(
  'Dashboard/getLoaddashboardPaymentStatus',
  async (params, thunkAPI) => {
    try {
      const response = await DashboardService.getLoaddashboardPaymentStatus(params);
      // thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      //
      return { LoaddashboardPayment: response.data.data.transactionList };
    } catch (error) {
      const message =
        (error.response && error.response.data.message) || error.message || error.toString();
      // thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getAllRoles = createAsyncThunk('Dashboard/getAllRoles', async (_, thunkAPI) => {
  try {
    const response = await DashboardService.getAllRoles();

    return { AllRolesList: response.data.data };
  } catch (error) {
    const message =
      (error.response && error.response.data.message) || error.message || error.toString();
    thunkAPI.dispatch(setMessage({ message, type: 'error' }));
    return thunkAPI.rejectWithValue(message);
  }
});

export const postSaveRole = createAsyncThunk('Dashboard/postSaveRole', async (data, thunkAPI) => {
  try {
    const response = await DashboardService.postSaveRole(data);
    return { SaveRoleResponse: response.data.message };
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});

export const getRoleById = createAsyncThunk('Dashboard/getRoleById', async (Roleid, thunkAPI) => {
  try {
    const response = await DashboardService.getRoleById(Roleid);
    console.log('responseeeeeee', response.data.data);
    return {
      RoleByIdResponse: response.data.data,
    };
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});

export const deleteRole = createAsyncThunk('Dashboard/deleteRole', async (roleId, thunkAPI) => {
  try {
    const response = await DashboardService.deleteRole(roleId);
    //return { DeleteRoleResponse: response.data.status};
    return response.data.status;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateRole = createAsyncThunk('Dashboard/updateRole', async (data, thunkAPI) => {
  try {
    const response = await DashboardService.updateRole(data);
    return { updateRoleResponse: response.data.data };
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});

export const uploadExcelData = createAsyncThunk(
  'Dashboard/uploadExcelData',
  async (formData, thunkAPI) => {
    try {
      const response = await DashboardService.uploadExcelData(formData);
      thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return { uploadedDataResponse: response.data.data, message: response.data.message };
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
      } else if (errorData?.message) {
        message = errorData.message;
      }

      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue();
    }
  },
);

export const getReportedList = createAsyncThunk(
  'Dashboard/getReportedList',
  async ({ HeaderId }, thunkAPI) => {
    try {
      const response = await DashboardService.getReportedList({ HeaderId });
      return {
        getListReport: response.data.data,
      };
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

export const submitPayment = createAsyncThunk(
  'Dashboard/submitPayment',
  async (payload, thunkAPI) => {
    try {
      const response = await DashboardService.submitPayment(payload);
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

export const getReportedListNW = createAsyncThunk(
  'Dashboard/getReportedListNW',
  async ({ HeaderId }, thunkAPI) => {
    try {
      const response = await DashboardService.getReportedListNW({ HeaderId });
      return {
        getListReport: response.data.data,
      };
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

export const getReportedListSelf = createAsyncThunk(
  'Dashboard/getReportedListSelf',
  async ({ HeaderId }, thunkAPI) => {
    try {
      const response = await DashboardService.getReportedListSelf({ HeaderId });
      return {
        getListReport: response.data.data,
      };
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

export const reconciliationGet = createAsyncThunk(
  'Dashboard/reconciliationGet',
  async ({ pageNumber, pageSize, fromDate, toDate, status, cardHolderName }, thunkAPI) => {
    try {
      const response = await DashboardService.reconciliationGet(
        pageNumber,
        pageSize,
        fromDate,
        toDate,
        status,
        cardHolderName,
      );
      console.log('responseee', response);
      return { ReconciliationDataResponse: response.data.data };
    } catch (error) {
      const message =
        (error.response && error.response.data.message) || error.message || error.toString();
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const ExcelreconciliationGet = createAsyncThunk(
  'Dashboard/ExcelreconciliationGet',
  async (_, thunkAPI) => {
    try {
      const response = await DashboardService.ExcelreconciliationGet();
      console.log('responseee', response);
      return { ReconciliationDataResponse: response.data.data };
    } catch (error) {
      const message =
        (error.response && error.response.data.message) || error.message || error.toString();
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const ExportCompany = createAsyncThunk(
  'Dashboard/ExportCompany',
  async (params, thunkAPI) => {
    try {
      const response = await DashboardService.ExportCompany(params);
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

export const ExportNotWorking = createAsyncThunk(
  'Dashboard/ExportNotWorking',
  async (params, thunkAPI) => {
    try {
      const response = await DashboardService.ExportNotWorking(params);
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

export const deleteContibutionAdmin = createAsyncThunk(
  'Dashboard/deleteContibutionAdmin',
  async ({ headerId, userid, type }, thunkAPI) => {
    try {
      const response = await DashboardService.deleteContibutionAdmin(headerId, userid, type); // Assuming this fetches
      thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return { c3DeleteResponse: response.data }; // response.data should be the staff array
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

export const adminSearchResultsC3 = createAsyncThunk(
  'Dashboard/adminSearchResultsC3',
  async ({ receiptId, userId }, thunkAPI) => {
    try {
      const response = await DashboardService.adminSearchResultsC3(receiptId, userId); // Assuming this fetches
      thunkAPI.dispatch(setMessage({ message: response.message, type: 'success' }));
      return { PaymentC3Response: response.data }; // response.data should be the staff array
    } catch (error) {
      
      const message =
        (error.response && error.response.data && error.response.data) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue();
    }
  },
);

export const adminSearchResultsNW = createAsyncThunk(
  'Dashboard/adminSearchResultsNW',
  async ({ receiptId, userId }, thunkAPI) => {
    try {
      const response = await DashboardService.adminSearchResultsNW(receiptId, userId); // Assuming this fetches
      thunkAPI.dispatch(setMessage({ message: response.message, type: 'success' }));
      return { PaymentNWResponse: response.data }; // response.data should be the staff array
    } catch (error) {
      
      const message =
        (error.response && error.response.data && error.response.data) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue();
    }
  },
);

export const adminSearchResultsSelf = createAsyncThunk(
  'Dashboard/adminSearchResultsSelf',
  async ({ receiptId, userId }, thunkAPI) => {
    try {
      const response = await DashboardService.adminSearchResultsSelf(receiptId, userId); // Assuming this fetches
      thunkAPI.dispatch(setMessage({ message: response.message, type: 'success' }));
      return { PaymentSelfResponse: response.data }; // response.data should be the staff array
    } catch (error) {
      
      const message =
        (error.response && error.response.data && error.response.data) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue();
    }
  },
);

const CSlice = createSlice({
  name: 'Dashboard',
  initialState: {
    ContributionCount: [],
    StatusData: [],
    DirectorContributionCount: [],
    ContributionList: [],
    DirectorContributionList: [],
    previewData: [],
    previewNWDataList: [],
    CompanyDropdown: [],
    CompanyDropdownRes: [],
    LoaddashboardPayment: [],
    AllRoles: [],
    SaveRole: [],
    RoleById: [],
    DeleteRole: [],
    UpdateRoleData: [],
    uploadedData: [],
    ReconciliationData: [],
    ReconciliationExcel: [],
    AllRolesList: [],
    getListReport: [],
    ColumnData: [],
    updateRecord: [],
    PaymentC3Response: [],
    PaymentNWResponse: [],
    PaymentSelfResponse: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearContributionCount: (state) => {
      state.ContributionCount = [];
    },
  },
  extraReducers: (builder) => {
    builder

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

      .addCase(getStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.StatusData = action.payload.StatusData;
      })
      .addCase(getStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.ContributionCount = [];
      })

      .addCase(getContributionSingle.pending, (state) => {
        state.loading = true;
      })
      .addCase(getContributionSingle.fulfilled, (state, action) => {
        state.loading = false;
        state.ContributionCount = action.payload.ContributionCount;
      })
      .addCase(getContributionSingle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.ContributionCount = [];
      })

      .addCase(ColumnGet.pending, (state) => {
        state.loading = true;
      })
      .addCase(ColumnGet.fulfilled, (state, action) => {
        state.loading = false;
        state.ColumnData = action.payload.ColumnData;
      })
      .addCase(ColumnGet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.ColumnData = [];
      })

      .addCase(getDirectorContribution.pending, (state) => {
        state.loading = true;
      })

      .addCase(getDirectorContribution.fulfilled, (state, action) => {
        state.loading = false;
        state.DirectorContributionCount = action.payload.DirectorContributionCount;
      })
      .addCase(getDirectorContribution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.DirectorContributionCount = [];
      })

      .addCase(getContributionList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getContributionList.fulfilled, (state, action) => {
        state.loading = false;
        state.ContributionList = action.payload.ContributionList;
      })
      .addCase(getContributionList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.ContributionList = [];
      })

      .addCase(getDirectorContributionList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDirectorContributionList.fulfilled, (state, action) => {
        state.loading = false;
        state.DirectorContributionList = action.payload.DirectorContributionList;
      })
      .addCase(getDirectorContributionList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.DirectorContributionList = [];
      })
      .addCase(previewAllData.pending, (state) => {
        state.loading = true;
      })
      .addCase(previewAllData.fulfilled, (state, action) => {
        state.loading = false;
        state.previewData = action.payload.previewResponse;
      })
      .addCase(previewAllData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.previewData = [];
      })
      .addCase(previewNWData.pending, (state) => {
        state.loading = true;
      })
      .addCase(previewNWData.fulfilled, (state, action) => {
        //
        state.loading = false;
        state.previewNWDataList = action.payload.previewNWResponse;
      })
      .addCase(previewNWData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.previewNWDataList = [];
      })

      .addCase(ImportCThree.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(ImportCThree.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.ContributionCount.unshift(action.payload);
        if (!Array.isArray(state.ContributionCount)) {
          state.ContributionCount = [];
        }

        state.ContributionCount.unshift(action.payload);
      })

      .addCase(ImportCThree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(ImportCThreeLatest.pending, (state, action) => {
        state.loading = true;
        state.success = false;
        if (!Array.isArray(state.ContributionCount)) {
          state.ContributionCount = [];
        }

        state.ContributionCount.unshift(action.payload);
      })
      .addCase(ImportCThreeLatest.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })

      .addCase(ImportCThreeLatest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(dashboardSubmitContribution.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(dashboardSubmitContribution.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })

      .addCase(dashboardSubmitContribution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(ReconcileData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(ReconcileData.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(ReconcileData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(getReconcilationUpdate.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReconcilationUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.updateRecord = action.payload.updateRecord;
      })
      .addCase(getReconcilationUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.updateRecord = [];
      })

      .addCase(reconcilationUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(reconcilationUpdate.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(reconcilationUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(UpdateStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(UpdateStatus.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(UpdateStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(StatusChange.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(StatusChange.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(StatusChange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(CustomizeData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(CustomizeData.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(CustomizeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(dashboardSubmitDirector.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(dashboardSubmitDirector.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(dashboardSubmitDirector.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(getCompanyDropdown.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCompanyDropdown.fulfilled, (state, action) => {
        state.loading = false;
        state.CompanyDropdown = action.payload.CompanyDropdownResponse;
      })
      .addCase(getCompanyDropdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.CompanyDropdown = [];
      })

      .addCase(getCompanyDropdownUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCompanyDropdownUser.fulfilled, (state, action) => {
        state.loading = false;
        state.CompanyDropdownRes = action.payload.CompanyDropdownRes;
      })
      .addCase(getCompanyDropdownUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.CompanyDropdownRes = [];
      })

      .addCase(getLoaddashboardPaymentStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLoaddashboardPaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.LoaddashboardPayment = action.payload.LoaddashboardPayment;
      })
      .addCase(getLoaddashboardPaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.LoaddashboardPayment = [];
      })

      .addCase(getAllRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.AllRolesList = action.payload.AllRolesList;
      })
      .addCase(getAllRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.AllRoles = [];
      })

      .addCase(postSaveRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(postSaveRole.fulfilled, (state, action) => {
        state.loading = false;
        state.SaveRole = action.payload.SaveRoleResponse;
      })
      .addCase(postSaveRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.SaveRole = [];
      })

      .addCase(getRoleById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRoleById.fulfilled, (state, action) => {
        state.loading = false;
        state.RoleById = action.payload.RoleByIdResponse;
      })
      .addCase(getRoleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.RoleById = [];
      })
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false;
        state.DeleteRole = action.payload.DeleteRoleResponse;
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.DeleteRole = [];
      })

      .addCase(updateRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        state.UpdateRoleData = action.payload.updateRoleResponse;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.UpdateRoleData = [];
      })

      .addCase(uploadExcelData.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadExcelData.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadedData = action.payload.uploadedDataResponse;
      })
      .addCase(uploadExcelData.rejected, (state) => {
        state.loading = false;
      })

      .addCase(reconciliationGet.pending, (state) => {
        state.loading = true;
      })
      .addCase(reconciliationGet.fulfilled, (state, action) => {
        state.loading = false;
        state.ReconciliationData = action.payload.ReconciliationDataResponse;
      })
      .addCase(reconciliationGet.rejected, (state) => {
        state.loading = false;
      })

      .addCase(ExcelreconciliationGet.pending, (state) => {
        state.loading = true;
      })
      .addCase(ExcelreconciliationGet.fulfilled, (state, action) => {
        state.loading = false;
        state.ReconciliationExcel = action.payload.ReconciliationDataResponse;
      })
      .addCase(ExcelreconciliationGet.rejected, (state) => {
        state.loading = false;
      })

      .addCase(ExportCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(ExportCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.SelfEmployeeData = action.payload;
      })

      .addCase(ExportCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(ExportNotWorking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(ExportNotWorking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.SelfEmployeeData = action.payload;
      })

      .addCase(ExportNotWorking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(getReportedList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReportedList.fulfilled, (state, action) => {
        state.loading = false;
        state.getListReport = action.payload.getListReport;
      })
      .addCase(getReportedList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch report list';
      })

      .addCase(submitPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitPayment.fulfilled, (state, action) => {
        state.loading = false;
        // state.UpdateRoleData = action.payload.updateRoleResponse;
      })
      .addCase(submitPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        // state.UpdateRoleData = [];
      })

      .addCase(getReportedListNW.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReportedListNW.fulfilled, (state, action) => {
        state.loading = false;
        state.getListReport = action.payload.getListReport;
      })
      .addCase(getReportedListNW.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch report list';
      })

      .addCase(deleteContibutionAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteContibutionAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.c3Delete = action.payload.c3DeleteResponse;
      })
      .addCase(deleteContibutionAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.c3Delete = [];
      })

      .addCase(adminSearchResultsC3.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminSearchResultsC3.fulfilled, (state, action) => {
        state.loading = false;
        state.PaymentC3Response = action.payload.PaymentC3Response;
      })
      .addCase(adminSearchResultsC3.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.PaymentC3Response = [];
      })

      .addCase(adminSearchResultsNW.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminSearchResultsNW.fulfilled, (state, action) => {
        state.loading = false;
        state.PaymentNWResponse = action.payload.PaymentNWResponse;
      })
      .addCase(adminSearchResultsNW.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.PaymentNWResponse = [];
      })

      .addCase(adminSearchResultsSelf.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminSearchResultsSelf.fulfilled, (state, action) => {
        state.loading = false;
        state.PaymentSelfResponse = action.payload.PaymentSelfResponse;
      })
      .addCase(adminSearchResultsSelf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.PaymentSelfResponse = [];
      })

      .addCase(getReportedListSelf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReportedListSelf.fulfilled, (state, action) => {
        state.loading = false;
        state.getListReport = action.payload.getListReport;
      })
      .addCase(getReportedListSelf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch report list';
      });
  },
});

export const { clearContributionCount } = CSlice.actions;
export default CSlice.reducer;
