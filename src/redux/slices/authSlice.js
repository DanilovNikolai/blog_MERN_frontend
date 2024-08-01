import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params) => {
  const { data } = await axios.post('/auth/login', params);
  return data;
});

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
  const { data } = await axios.get('/auth/me');
  return data;
});

export const fetchRegister = createAsyncThunk(
  'auth/fetchRegister',
  async (params) => {
    const { data } = await axios.post('/auth/register', params);
    return data;
  }
);

export const fetchUserUpdate = createAsyncThunk(
  'auth/fetchUserUpdate',
  async ({id, params}) => {
    const { data } = await axios.patch(`/users/${id}`, params);
    return data;
  }
);

const initialState = {
  userData: null,
  status: 'loading',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.userData = null;
    },
  },
  extraReducers: {
    [fetchAuth.pending]: (state) => {
      state.userData = null;
      state.status = 'loading';
    },
    [fetchAuth.fulfilled]: (state, action) => {
      state.userData = action.payload;
      state.status = 'loaded';
    },
    [fetchAuth.rejected]: (state) => {
      state.userData = null;
      state.status = 'error';
    },
    [fetchAuthMe.pending]: (state) => {
      state.userData = null;
      state.status = 'loading';
    },
    [fetchAuthMe.fulfilled]: (state, action) => {
      state.userData = action.payload;
      state.status = 'loaded';
    },
    [fetchAuthMe.rejected]: (state) => {
      state.userData = null;
      state.status = 'error';
    },
    [fetchRegister.pending]: (state) => {
      state.userData = null;
      state.status = 'loading';
    },
    [fetchRegister.fulfilled]: (state, action) => {
      state.userData = action.payload;
      state.status = 'loaded';
    },
    [fetchRegister.rejected]: (state) => {
      state.userData = null;
      state.status = 'error';
    },
    [fetchUserUpdate.pending]: (state) => {
      state.status = 'loading';
    },
    [fetchUserUpdate.fulfilled]: (state, action) => {
      state.userData = { ...state.userData, ...action.payload };
      state.status = 'loaded';
    },
    [fetchUserUpdate.rejected]: (state) => {
      state.status = 'error';
    },
  },
});

export const selectIsAuth = (state) => !!state.auth.userData;

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;
