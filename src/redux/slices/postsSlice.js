import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await axios.get('/posts');
  return data;
});

export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (id) => {
    const { data } = await axios.get(`/posts/${id}`);
    return data;
  }
);

export const fetchPostsByViews = createAsyncThunk(
  'posts/fetchPostsByViews',
  async () => {
    const { data } = await axios.get('/posts/popular');
    return data;
  }
);

export const fetchPostsByTags = createAsyncThunk(
  'posts/fetchPostsByTags',
  async (tag) => {
    const { data } = await axios.get(`/tags/${tag}`);
    return data;
  }
);

export const fetchRemovePost = createAsyncThunk(
  'posts/fetchRemovePost',
  async (id) => {
    await axios.delete(`/posts/${id}`);
    return id;
  }
);

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
  const { data } = await axios.get('/tags');
  return data;
});

export const fetchPostLikes = createAsyncThunk(
  'posts/fetchPostLikes',
  async (id) => {
    const { data } = await axios.patch(`/posts/${id}/like`);
    return { id, likesCount: data.likesCount, likedBy: data.likedBy };
  }
);

const initialState = {
  posts: {
    items: [],
    status: 'loading',
  },
  tags: {
    items: [],
    status: 'loading',
  },
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: {
    // Получение статей
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },

    // Получение конкретной статьи
    [fetchPostById.pending]: (state) => {
      state.posts.status = 'loading';
    },
    [fetchPostById.fulfilled]: (state, action) => {
      const post = action.payload;
      // Обновляем пост в массиве или добавляем его, если его нет
      const index = state.posts.items.findIndex((p) => p._id === post._id);
      if (index !== -1) {
        state.posts.items[index] = post;
      } else {
        state.posts.items.push(post);
      }
      state.posts.status = 'loaded';
    },
    [fetchPostById.rejected]: (state) => {
      state.posts.status = 'error';
    },

    // Получение популярных статей
    [fetchPostsByViews.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchPostsByViews.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchPostsByViews.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },

    // Получение статей по тэгам
    [fetchPostsByTags.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchPostsByTags.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchPostsByTags.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },

    // Получение тэгов
    [fetchTags.pending]: (state) => {
      state.tags.items = [];
      state.tags.status = 'loading';
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = 'loaded';
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = 'error';
    },

    // Удаление статьи
    [fetchRemovePost.pending]: (state) => {
      state.posts.status = 'loading';
    },
    [fetchRemovePost.fulfilled]: (state, action) => {
      state.posts.items = state.posts.items.filter(
        (item) => item._id !== action.payload
      );
      state.posts.status = 'loaded';
    },
    [fetchRemovePost.rejected]: (state) => {
      state.posts.status = 'error';
    },
    // Обновление количества лайков
    [fetchPostLikes.fulfilled]: (state, action) => {
      const postIndex = state.posts.items.findIndex(
        (post) => post._id === action.payload.id
      );
      if (postIndex !== -1) {
        state.posts.items[postIndex].likesCount = action.payload.likesCount;
      }
    },
  },
});

export const postsReducer = postsSlice.reducer;
