import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// mui
import Grid from '@mui/material/Grid';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostsByTags } from '../../redux/slices/postsSlice';
// components
import { Post } from '../../components/Post';

export const PostsByTags = () => {
  const { tag } = useParams(); // Получаем тег из URL
  const userData = useSelector((state) => state.auth.userData);
  const { posts, tags } = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  const isPostsLoading = posts.status === 'loading';

  useEffect(() => {
    dispatch(fetchPostsByTags(tag));
  }, [dispatch]);

  return (
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
              commentsCount={3}
              tags={obj.tags}
              isLoading={isPostsLoading}
              isEditable={userData?._id === obj.user._id}
            />
          )
        )}
      </Grid>
    </Grid>
  );
};
