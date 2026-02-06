import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: '',
  type: '', // 'success' or 'error'
};

const MessageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      return { message: action.payload.message, type: action.payload.type };
    },
    clearMessage: () => {
      return { message: '', type: '' };
    },
  },
});

const { reducer, actions } = MessageSlice;

export const { setMessage, clearMessage } = actions;
export default reducer;
