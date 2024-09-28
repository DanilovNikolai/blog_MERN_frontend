import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async () => {
    const { data } = await axios.get('/comments');
    return data;
  }
);

const initialState = {
  comments: {
    items: [],
    status: 'idle',
  },
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    // Action для добавления нового комментария
    addComment: (state, action) => {
      state.comments.items.push(action.payload);
    },
  },
  extraReducers: {
    // Получение комментариев
    [fetchComments.fulfilled]: (state, action) => {
      state.comments.items = action.payload;
      state.comments.status = 'succeeded';
    },
  },
});

export const { addComment } = commentsSlice.actions;
export const commentsReducer = commentsSlice.reducer;

