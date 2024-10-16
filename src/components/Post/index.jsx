import { useState } from 'react';
import { Link } from 'react-router-dom';
// clsx
import clsx from 'clsx';
// mui
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FavoriteIcon from '@mui/icons-material/FavoriteOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorderOutlined';
// scss
import styles from './Post.module.scss';
// components
import { UserInfo } from '../UserInfo';
import { PostSkeleton } from './Skeleton';
// redux-toolkit
import { useDispatch } from 'react-redux';
import { fetchRemovePost, fetchPostLikes } from '../../redux/slices/postsSlice';

export const Post = ({
  id,
  title,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  likesCount,
  commentsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable,
}) => {
  const [isLiked, setIsLiked] = useState();
  const dispatch = useDispatch();

  if (isLoading) {
    return <PostSkeleton />;
  }

  const onClickRemove = () => {
    if (window.confirm('Вы действительно хотите удалить статью?')) {
      dispatch(fetchRemovePost(id));
    }
  };

  const handleLike = async () => {
    try {
      await dispatch(fetchPostLikes(id));
      setIsLiked((prevLiked) => !prevLiked);
    } catch (err) {
      console.error('Ошибка при изменении лайка:', err);
    }
  };

  // Проверка на корректный URL
  const validImageUrl =
    imageUrl && imageUrl.startsWith('https://storage.yandexcloud.net')
      ? imageUrl
      : '/noimage.png';

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {imageUrl !== '' && (
        <img
          className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
          src={validImageUrl}
          alt={title}
        />
      )}
      <div className={styles.wrapper}>
        <UserInfo additionalText={createdAt} {...user} />
        <div className={styles.indention}>
          <h2
            className={clsx(styles.title, { [styles.titleFull]: isFullPost })}
          >
            {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
          </h2>
          <ul className={styles.tags}>
            {tags?.map((name) => (
              <li key={name}>
                <Link to={`/tags/${name}`}>#{name}</Link>
              </li>
            ))}
          </ul>
          {children && <div className={styles.content}>{children}</div>}
          <ul className={styles.postDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
            <li>
              <CommentIcon />
              <span>{commentsCount}</span>
            </li>
            <li>
              <IconButton onClick={handleLike}>
                {isLiked ? (
                  <FavoriteIcon style={{ color: 'red' }} />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
              <span>{likesCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
