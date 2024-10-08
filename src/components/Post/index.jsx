import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
// clsx
import clsx from 'clsx';
// mui
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
// scss
import styles from './Post.module.scss';
// components
import { UserInfo } from '../UserInfo';
import { PostSkeleton } from './Skeleton';
// redux-toolkit
import { useDispatch } from 'react-redux';
import { fetchRemovePost } from '../../redux/slices/postsSlice';

export const Post = ({
  id,
  title,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  commentsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable,
}) => {
  const dispatch = useDispatch();
  const imageRef = useRef(null); // Ref для картинки
  const [fitStyle, setFitStyle] = useState('contain'); // Состояние для object-fit

  useEffect(() => {
    if (imageRef.current) {
      const imageHeight = imageRef.current.naturalHeight; // Получаем высоту картинки
      if (imageHeight > 150) {
        setFitStyle('cover'); // Если больше 150px, применяем cover
      } else {
        setFitStyle('contain'); // Иначе contain
      }
    }
  }, [imageUrl]); // Вызов эффекта при изменении imageUrl

  if (isLoading) {
    return <PostSkeleton />;
  }

  const onClickRemove = () => {
    if (window.confirm('Вы действительно хотите удалить статью?')) {
      dispatch(fetchRemovePost(id));
    }
  };

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
      <img
        ref={imageRef}
        className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
        src={imageUrl}
        alt={title}
        style={{ objectFit: fitStyle }} // Применяем динамическое значение object-fit
      />
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
          </ul>
        </div>
      </div>
    </div>
  );
};
