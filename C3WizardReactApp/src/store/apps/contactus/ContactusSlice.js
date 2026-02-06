import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from '../message/MessageSlice';
import ContactusService from '../../../service/contactus/Contactus';


export const contactusPost = createAsyncThunk(
    'ContactUs/contactusPost',
    async (data,thunkAPI) => {
        
      try {
        const response = await ContactusService.contactusPost(data); 
        return { contactUsdata: response.data }; 
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


const ContectusSlice = createSlice({
  name: 'ContactUs',
  initialState: {
   
    ContactUsResult: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(contactusPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(contactusPost.fulfilled, (state, action) => {
        state.loading = false;
        state.ContactUsResult = action.payload.contactUsdata;
      })
      .addCase(contactusPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.ContactUsResult = [];
      })
},
});

export default ContectusSlice.reducer;