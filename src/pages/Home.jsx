import { useEffect, useState } from 'react';
// mui
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
// components
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
// redux
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPosts,
  fetchTags,
  fetchPostsByViews,
} from '../redux/slices/postsSlice';
import { fetchComments } from '../redux/slices/commentsSlice';

export const Home = () => {
  const [tabValue, setTabValue] = useState(0);
  const dispatch = useDispatch();
  const { posts, tags } = useSelector((state) => state.posts);
  const { comments } = useSelector((state) => state.comments);
  const userData = useSelector((state) => state.auth.userData);

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
    dispatch(fetchComments());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 1) {
      dispatch(fetchPostsByViews());
    } else if (newValue === 0) {
      dispatch(fetchPosts());
    }
  };

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={tabValue}
        aria-label="basic tabs example"
        onChange={handleTabChange}
      >
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={index}
                id={obj._id}
                title={obj.title}
                imageUrl={
                  obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''
                }
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={
                  comments.items?.filter(
                    (comment) => comment.postId === obj._id
                  ).length
                }
                tags={obj.tags}
                isLoading={isPostsLoading}
                isEditable={userData?._id === obj.user._id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock tags={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            comments={comments.items.slice(0, 5)} // Показываем последние 5 комментариев
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
