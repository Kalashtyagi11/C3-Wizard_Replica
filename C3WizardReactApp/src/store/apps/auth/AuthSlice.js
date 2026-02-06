import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { setMessage } from '../message/MessageSlice';
import AuthServices from '../../../service/auth/AuthService';

const user = JSON.parse(localStorage.getItem('isLogin'));

const initialState = {
  isLoggedIn: user,
  user: user || null,
  loading: false,
};

export const login = createAsyncThunk('auth/login', async ({ userName, userPass }, thunkAPI) => {
  try {
    const response = await AuthServices.login({ userName, userPass });

    // Extract necessary data
    const { data } = response;
    if (data?.data?.type === 'MFAProcess') {
      return data; // just return the MFA response to handle in handleLogin()
    }
    if (data?.data?.type === 'mailVarifyProcess') {
      return data; // just return the MFA response to handle in handleLogin()
    }
    const userData = data?.data || {};
    const token = userData.deviceToken;

    if (!token) throw new Error('Invalid login response: Missing token');

    // Store user details in localStorage
    localStorage.setItem('token', token);
    // if (userData.parentuserid === null) {
    localStorage.setItem('companyId', userData.companyId);

    localStorage.setItem('loginUserName', userData.loginUserName);
    localStorage.setItem('loginUserEmail', userData.loginUserEmail);
    localStorage.setItem('isSelfEmployed', userData.isSelfEmployed);
    localStorage.setItem('userID', userData.userId);

    localStorage.setItem('isLogin', true);
    localStorage.setItem('reG_NUMBER', userData.reG_NUMBER);
    localStorage.setItem('userImage', userData.profileImage);
    localStorage.setItem('companyLogo', userData.companyLogo);
    localStorage.setItem('isLevyExempt', userData.isLevyExempt);
    localStorage.setItem('roleId', userData.roleId);
    localStorage.setItem('roleName', userData.roleName);
    localStorage.setItem('userName', userData.user_Name);
    localStorage.setItem('logId', userData.logId);
    localStorage.setItem('roleCategory', userData.roleCategory);
    localStorage.setItem('mainDropDownId', userData.companyId);
    localStorage.setItem('parentIdID', userData.parentId);

    // Decode the token
    const decodedUser = jwtDecode(token);
    // thunkAPI.dispatch(setMessage({ message: data.message, type: 'success' }));

    return {
      user: decodedUser,
      isLoggedIn: true,
    };
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      'Login failed';

    // thunkAPI.dispatch(setMessage({ message, type: 'error' }));
    if (typeof message === 'string' && message.includes('User account is not active')) {
      // optionally handle redirect or other logic here
      return thunkAPI.rejectWithValue(message); // still reject, but don't show toast
    }
    thunkAPI.dispatch(setMessage({ message, type: 'error' }));
    return thunkAPI.rejectWithValue(message);
  }
});

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ formData }, thunkAPI) => {
    try {
      const response = await AuthServices.forgotPassword({ formData });
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

export const forgotDetails = createAsyncThunk(
  'auth/forgotDetails',
  async ({ formData }, thunkAPI) => {
    try {
      const response = await AuthServices.forgotDetails({ formData });

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

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ formData }, thunkAPI) => {
    try {
      const response = await AuthServices.changePassword({ formData });

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

export const getCardDetail = createAsyncThunk('auth/getCardDetail', async (userId, thunkAPI) => {
  try {
    const response = await AuthServices.getCardDetail(userId); // Assuming this fetches all staff
    return { CardData: response.data.data }; // response.data should be the staff array
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});

export const upDatecardDetails = createAsyncThunk(
  'auth/upDatecardDetails',
  async (editableCard, thunkAPI) => {
    try {
      const response = await AuthServices.upDatecardDetails(editableCard); // ✅ send directly
      thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const deleteCardDetails = createAsyncThunk(
  'auth/deleteCardDetails',
  async (editableCard, thunkAPI) => {
    try {
      const response = await AuthServices.deleteCardDetails(editableCard); // ✅ send directly
      // thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const selfRegister = createAsyncThunk(
  'auth/selfRegister',
  async ({ selfFormData }, thunkAPI) => {
    try {
      const response = await AuthServices.selfRegister({ selfFormData });
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

export const companyRegister = createAsyncThunk(
  'auth/companyRegister',
  async ({ formData }, thunkAPI) => {
    try {
      const response = await AuthServices.companyRegister({ formData });
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

export const getProfile = createAsyncThunk('auth/getProfile', async (userId, thunkAPI) => {
  try {
    const response = await AuthServices.getProfile(userId); // Assuming this fetches all staff
    return { profileData: response.data.data || response.data }; // response.data should be the staff array
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});

export const getProfiles = createAsyncThunk('auth/getProfiles', async (userId, thunkAPI) => {
  try {
    const response = await AuthServices.getProfiles(userId); // Assuming this fetches all staff
    return { profileDataNew: response.data.data || response.data }; // response.data should be the staff array
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});

export const getQuestionAnswer = createAsyncThunk(
  'auth/getQuestionAnswer',
  async ({ regNo, userName }, thunkAPI) => {
    try {
      const response = await AuthServices.getQuestionAnswer({ regNo, userName });
      // thunkAPI.dispatch(setMessage({ message: response.data.msg, type: 'success' }));
      return { getQuestAns: response.data.data }; // response.data should be the staff array
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.msg) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue();
    }
  },
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (formDataToSend, thunkAPI) => {
    try {
      const response = await AuthServices.updateProfile(formDataToSend);
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

export const getAllCategory = createAsyncThunk('auth/getAllCategory', async (_, thunkAPI) => {
  try {
    const response = await AuthServices.getAllCategory(); // Assuming this fetches all staff
    return { CategoryData: response.data.data }; // response.data should be the staff array
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});

export const getAllCountry = createAsyncThunk('auth/getAllCountry', async (_, thunkAPI) => {
  try {
    const response = await AuthServices.getAllCountry(); // Assuming this fetches all staff
    return { CountryData: response.data.data }; // response.data should be the staff array
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});

export const checkUser = createAsyncThunk(
  'auth/checkUser',
  async ({ SocSecNum, EmailId }, thunkAPI) => {
    try {
      const response = await AuthServices.checkUser({ SocSecNum, EmailId });
      // thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      return { selfUserDetails: response.data.data };
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

export const checkUserName = createAsyncThunk(
  'auth/checkUserName',
  async ({ UserName }, thunkAPI) => {
    try {
      const response = await AuthServices.checkUserName({ UserName });
      // thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
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

export const checkUserEmail = createAsyncThunk(
  'auth/checkUserEmail',
  async ({ EmailId, regNo }, thunkAPI) => {
    try {
      const response = await AuthServices.checkUserEmail({ EmailId, regNo });
      // thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
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

export const checkUserCompany = createAsyncThunk(
  'auth/checkUserCompany',
  async ({ EmailId, regNo }, thunkAPI) => {
    try {
      const response = await AuthServices.checkUserCompany({ EmailId, regNo });
      thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
      // return response.data;
      return { userDetails: response.data.data };
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

export const logout = createAsyncThunk('auth/logout', async ({ logId }, thunkAPI) => {
  try {
    const response = await AuthServices.logout({ logId });
    // thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
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

export const checkUserNameCompany = createAsyncThunk(
  'auth/checkUserNameCompany',
  async ({ UserName }, thunkAPI) => {
    try {
      const response = await AuthServices.checkUserNameCompany({ UserName });
      // thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));
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

export const ExitingUser = createAsyncThunk('auth/ExitingUser', async (formData, thunkAPI) => {
  try {
    const response = await AuthServices.ExitingUser(formData);
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
export const verificationUser = createAsyncThunk(
  'auth/verificationUser',
  async (formData, thunkAPI) => {
    try {
      const response = await AuthServices.verificationUser(formData);
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

export const ImportEmployee = createAsyncThunk(
  'auth/ImportEmployee',
  async (formData, thunkAPI) => {
    try {
      const response = await AuthServices.ImportEmployee(formData);
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

export const resetUerPassword = createAsyncThunk(
  'auth/resetUerPassword',
  async (formData, thunkAPI) => {
    try {
      const response = await AuthServices.resetUerPassword(formData);

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

export const VerificationLink = createAsyncThunk(
  'auth/VerificationLink',
  async ({ UserName, Password }, thunkAPI) => {
    try {
      const response = await AuthServices.VerificationLink({ UserName, Password });
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

export const VerifyMFAOtp = createAsyncThunk(
  'auth/VerifyMFAOtp',
  async ({ userId, type, code }, thunkAPI) => {
    
    try {
      const response = await AuthServices.VerifyMFAOtp(userId, type, code);
      const dataUser = response.data.data;

      if (!dataUser) throw new Error('Invalid response: Missing user data');

      localStorage.setItem('userId', dataUser.userId);
      localStorage.setItem('userID', dataUser.userId);
      localStorage.setItem('loginUserName', dataUser.loginUserName);
      localStorage.setItem('loginUserEmail', dataUser.loginUserEmail);
      localStorage.setItem('isSelfEmployed', dataUser.isSelfEmployed);
      localStorage.setItem('companyId', dataUser.companyId);
      localStorage.setItem('reG_NUMBER', dataUser.reG_NUMBER);
      localStorage.setItem('userImage', dataUser.profileImage);
      localStorage.setItem('companyLogo', dataUser.companyLogo);
      localStorage.setItem('isLevyExempt', dataUser.isLevyExempt);
      localStorage.setItem('roleId', dataUser.roleId);
      localStorage.setItem('roleName', dataUser.roleName);
      localStorage.setItem('userName', dataUser.user_Name);
      localStorage.setItem('logId', dataUser.logId);
      localStorage.setItem('roleCategory', dataUser.roleCategory);
      localStorage.setItem('mainDropDownId', dataUser.companyId);
      localStorage.setItem('parentIdID', dataUser.parentId);
      localStorage.setItem('deviceToken', dataUser.deviceToken);
      localStorage.setItem('isLogin', true);
      thunkAPI.dispatch(setMessage({ message: response.data.message, type: 'success' }));

      return dataUser;
    } catch (error) {
      const message =
        typeof error.response?.data === 'string'
          ? error.response.data // Handle plain string response
          : error.response?.data?.message || error.message || error.toString();
      thunkAPI.dispatch(setMessage({ message, type: 'error' }));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  profileData: [],
  CategoryData: [],
  CountryData: [],
  getQuestAns: [],
  profileDataNew: [],
  userDetails: [],
  selfUserDetails: [],
  CardData: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        console.log('Login Pending');
        state.loading = true;
        state.isLoggedIn = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log('Login Fulfilled:', action.payload); // Log payload
        state.isLoggedIn = true;
        state.loading = false;

        const userDecode = action.payload.user;
        if (userDecode) {
          state.user = userDecode; // Set only user data in state
        }
      })
      .addCase(login.rejected, (state) => {
        console.log('Login Rejected');
        state.loading = false;
        state.isLoggedIn = false;
      })

      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(forgotDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(forgotDetails.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(forgotDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(resetUerPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(resetUerPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(resetUerPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(getCardDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCardDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.CardData = action.payload.CardData;
      })
      .addCase(getCardDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(upDatecardDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(upDatecardDetails.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(upDatecardDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(deleteCardDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteCardDetails.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(deleteCardDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(selfRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(selfRegister.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(selfRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(checkUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(checkUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.selfUserDetails = action.payload.selfUserDetails;
      })
      .addCase(checkUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(checkUserName.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(checkUserName.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(checkUserName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(checkUserEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(checkUserEmail.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(checkUserEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(checkUserCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(checkUserCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.userDetails = action.payload.userDetails;
      })
      .addCase(checkUserCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(checkUserNameCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(checkUserNameCompany.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(checkUserNameCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(companyRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(companyRegister.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(companyRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(getAllCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.CategoryData = action.payload.CategoryData;
      })
      .addCase(getAllCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.CategoryData = [];
      })

      .addCase(getAllCountry.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCountry.fulfilled, (state, action) => {
        state.loading = false;
        state.CountryData = action.payload.CountryData;
      })
      .addCase(getAllCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.CountryData = [];
      })

      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = action.payload.profileData;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.profileData = [];
      })

      .addCase(getProfiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profileDataNew = action.payload.profileDataNew;
      })
      .addCase(getProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.profileDataNew = [];
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = action.payload.data;
        state.profileDataNew = action.payload.data;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(getQuestionAnswer.pending, (state) => {
        state.loading = true;
      })
      .addCase(getQuestionAnswer.fulfilled, (state, action) => {
        state.loading = false;
        state.getQuestAns = action.payload.getQuestAns;
      })
      .addCase(getQuestionAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.getQuestAns = [];
      })

      .addCase(ExitingUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(ExitingUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(ExitingUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(verificationUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(verificationUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(verificationUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(ImportEmployee.pending, (state) => {
        state.loadingModal = true;
        state.error = null;
        state.success = false;
      })
      .addCase(ImportEmployee.fulfilled, (state) => {
        state.loadingModal = false;
        state.success = true;
      })
      .addCase(ImportEmployee.rejected, (state, action) => {
        state.loadingModal = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(VerificationLink.pending, (state) => {
        state.loadingModal = true;
        state.error = null;
        state.success = false;
      })
      .addCase(VerificationLink.fulfilled, (state) => {
        state.loadingModal = false;
        state.success = true;
      })
      .addCase(VerificationLink.rejected, (state, action) => {
        state.loadingModal = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(VerifyMFAOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(VerifyMFAOtp.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(VerifyMFAOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export default AuthSlice.reducer;
