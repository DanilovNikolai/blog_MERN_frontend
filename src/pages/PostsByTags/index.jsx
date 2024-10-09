import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// mui
import Grid from '@mui/material/Grid';
import { useMediaQuery } from '@mui/material';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostsByTags, fetchTags } from '../../redux/slices/postsSlice';
import { fetchComments } from '../../redux/slices/commentsSlice';
// components
import { Post } from '../../components/Post';
import { TagsBlock } from '../../components/TagsBlock';
import { CommentsBlock } from '../../components/CommentsBlock';
// styles
import styles from './PostsByTags.module.scss';
// utils
import { formatDate } from '../../utils/formatDate';

export const PostsByTags = () => {
  const { tag } = useParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const { posts, tags } = useSelector((state) => state.posts);
  const { comments } = useSelector((state) => state.comments);
  const [filteredComments, setFilteredComments] = useState([]);

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  const isCommentsLoading = comments.status === 'loading';

  // Определяем, является ли устройство мобильным
  const isMobile = useMediaQuery('(max-width:900px)');

  // Загружаем посты по тэгу
  useEffect(() => {
    dispatch(fetchPostsByTags(tag));
    dispatch(fetchTags());
    dispatch(fetchComments());
  }, [dispatch, tag]);

  // Фильтрация комментариев по постам с нужным тэгом
  useEffect(() => {
    const commentsForPostsByTag = comments.items?.filter((comment) =>
      posts.items?.some((post) => post._id === comment.postId)
    );
    setFilteredComments(commentsForPostsByTag);
  }, [posts, comments]);

  return (
    <>
      <div className={styles.root}>
        <div className={styles.wrapper}>
          <div className={styles.content}>
            Найдены все посты по тэгу: <span>#{tag}</span>
          </div>
        </div>
      </div>
      <Grid container spacing={isMobile ? 0 : 4}>
        <Grid xs={isMobile ? 12 : 9} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={index}
                id={obj._id}
                title={obj.title}
                imageUrl={
                  obj.imageUrl
                    ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}`
                    : '/noimage.png'
                }
                user={obj.user}
                createdAt={formatDate(obj.createdAt)}
                viewsCount={obj.viewsCount}
                commentsCount={
                  comments.items.filter((comment) => comment.postId === obj._id)
                    .length
                }
                tags={obj.tags}
                isLoading={isPostsLoading}
                isEditable={userData?._id === obj.user._id}
              />
            )
          )}
        </Grid>

        {!isMobile && (
          <Grid xs={3} item>
            <TagsBlock tags={tags.items} isLoading={isTagsLoading} />
            {comments && (
              <CommentsBlock
                comments={filteredComments}
                isLoading={isCommentsLoading}
              />
            )}
          </Grid>
        )}

        {isMobile && (
          <Grid xs={12} item>
            <TagsBlock
              tags={tags.items}
              isLoading={isTagsLoading}
              isMobile={isMobile}
            />
            {comments && (
              <CommentsBlock
                comments={filteredComments}
                isLoading={isCommentsLoading}
                isMobile={isMobile}
              />
            )}
          </Grid>
        )}
      </Grid>
    </>
  );
};
