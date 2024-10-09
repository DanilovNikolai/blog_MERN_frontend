import { useEffect, useState } from 'react';
// mui
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useMediaQuery } from '@mui/material';
// components
import { Post } from '../../components/Post';
import { TagsBlock } from '../../components/TagsBlock';
import { CommentsBlock } from '../../components/CommentsBlock';
// redux
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPosts,
  fetchTags,
  fetchPostsByViews,
} from '../../redux/slices/postsSlice';
import { fetchComments } from '../../redux/slices/commentsSlice';
// utils
import { formatDate } from '../../utils/formatDate';
// styles
import styles from './Home.module.scss';

export const Home = () => {
  const [tabValue, setTabValue] = useState(0);
  const dispatch = useDispatch();
  const { posts, tags } = useSelector((state) => state.posts);
  const { comments } = useSelector((state) => state.comments);
  const userData = useSelector((state) => state.auth.userData);

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  const isCommentsLoading = comments.status === 'loading';

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

  // Определяем, является ли устройство мобильным
  const isMobile = useMediaQuery('(max-width:900px)');

  return (
    <>
      <Tabs
        style={isMobile ? { marginBottom: 8 } : { marginBottom: 15 }}
        value={tabValue}
        aria-label="basic tabs example"
        onChange={handleTabChange}
        className={styles.tabs}
      >
        <Tab className={styles.tab} label="Новые" />
        <Tab className={styles.tab} label="Популярные" />
      </Tabs>

      <Grid container spacing={isMobile ? 0 : 4}>
        <Grid xs={isMobile ? 12 : 8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={obj._id}
                id={obj._id}
                title={obj.title}
                imageUrl={
                  obj.imageUrl
                    ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}`
                    : 'http://localhost:3000/noimage.png'
                }
                user={obj.user}
                createdAt={formatDate(obj.createdAt)}
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

        {!isMobile && (
          <Grid xs={4} item>
            <TagsBlock tags={tags.items} isLoading={isTagsLoading} />
            <CommentsBlock
              comments={comments.items.slice(0, 5)}
              isLoading={false}
            />
          </Grid>
        )}

        {isMobile && (
          <>
            <Grid xs={12} item>
              <TagsBlock
                tags={tags.items}
                isLoading={isTagsLoading}
                isMobile={isMobile}
              />
            </Grid>
            <Grid xs={12} item>
              <CommentsBlock
                comments={comments.items.slice(0, 5)}
                isLoading={isCommentsLoading}
                isMobile={isMobile}
              />
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};
