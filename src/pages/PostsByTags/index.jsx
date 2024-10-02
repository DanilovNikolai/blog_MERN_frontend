import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// mui
import Grid from '@mui/material/Grid';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostsByTags } from '../../redux/slices/postsSlice';
// components
import { Post } from '../../components/Post';
import { TagsBlock } from '../../components/TagsBlock';
import { CommentsBlock } from '../../components/CommentsBlock';
// styles
import styles from './PostsByTags.module.scss';

export const PostsByTags = () => {
  const { tag } = useParams();
  const userData = useSelector((state) => state.auth.userData);
  const { posts, tags } = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';

  useEffect(() => {
    dispatch(fetchPostsByTags(tag));
  }, [dispatch, tag]);

  return (
    <>
      <div className={styles.root}>
        <div className={styles.wrapper}>
          <div className={styles.content}>
            Найдены все посты по тэгу: <span>{tag}</span>
          </div>
        </div>
      </div>
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
                  obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ''
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
        <Grid xs={4} item>
          <TagsBlock tags={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Вася Пупкин',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Это тестовый комментарий',
              },
              {
                user: {
                  fullName: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
