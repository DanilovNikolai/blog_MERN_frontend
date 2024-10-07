import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

// Асинхронный экшен для получения комментариев
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async () => {
    const { data } = await axios.get('/comments');
    return data;
  }
);

// Асинхронный экшен для добавления нового комментария
export const fetchAddComment = createAsyncThunk(
  'comments/fetchAddComment',
  async (newComment) => {
    const { data } = await axios.post('/comments', newComment);
    return data; // Возвращаем созданный комментарий
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
  reducers: {},
  extraReducers: {
    // Получение комментариев
    [fetchComments.fulfilled]: (state, action) => {
      state.comments.items = action.payload;
      state.comments.status = 'succeeded';
    },
    // Добавление комментария
    [fetchAddComment.pending]: (state) => {
      state.comments.status = 'loading';
    },
    [fetchAddComment.fulfilled]: (state, action) => {
      state.comments.items.push(action.payload); // Добавляем новый комментарий в конец списка
      state.comments.status = 'succeeded';
    },
    [fetchAddComment.rejected]: (state) => {
      state.comments.status = 'failed';
    },
  },
});

export const commentsReducer = commentsSlice.reducer;
