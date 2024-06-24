import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async () => {
    const { data } = await axios.post('/auth/login');
    return data;
  }
);

const initialState = {
  data: null,
  status: 'loading',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: {
    [fetchUserData.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchUserData.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchUserData.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },
  },
});
