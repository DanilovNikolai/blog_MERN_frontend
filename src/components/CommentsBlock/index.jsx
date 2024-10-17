import React, { useState, useEffect } from 'react';
// mui
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import { SideBlock } from '../SideBlock';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Skeleton from '@mui/material/Skeleton';
// router
import { useLocation } from 'react-router-dom';
// utils
import { formatDate } from '../../utils/formatDate';
// styles
import styles from './CommentsBlock.module.scss';
// redux
import { useDispatch, useSelector } from 'react-redux';

export const CommentsBlock = ({
  comments = [],
  postId,
  children,
  isLoading = true,
  isMobile,
}) => {
  const location = useLocation();
  const [commentsVisible, setCommentsVisible] = useState(!isMobile);
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();

  // Сбрасываем видимость комментариев при смене режима (mobile/desktop)
  useEffect(() => {
    setCommentsVisible(!isMobile);
  }, [isMobile]);

  let resultComments = [];
  let title;

  if (
    location.pathname === '/' ||
    (location.pathname.startsWith('/tags') && comments.length)
  ) {
    resultComments = comments.slice(0, 5);
    title = resultComments.length
      ? 'Последние комментарии'
      : 'Здесь пока пусто...';
  } else if (
    location.pathname.startsWith(`/posts/${postId}`) &&
    comments.length
  ) {
    resultComments = comments;
    title = resultComments.length ? 'Комментарии' : 'Здесь пока пусто...';
  }

  const handleShowComments = () => {
    if (isMobile) {
      setCommentsVisible(!commentsVisible);
    }
  };

  // const onClickRemove = () => {
  //   if (window.confirm('Вы действительно хотите удалить статью?')) {
  //     dispatch(fetchRemovePost(id));
  //   }
  // };

  return (
    <SideBlock
      title={
        <div className={styles.title} onClick={handleShowComments}>
          <span>{title}</span>{' '}
          {isMobile && (
            <span className={styles.arrow}>{commentsVisible ? '▲' : '▼'}</span>
          )}
        </div>
      }
    >
      <List
        className={`${styles.list} ${
          commentsVisible ? styles.show : styles.hide
        }`}
      >
        {(isLoading ? [...Array(5)] : resultComments)?.map((comment, index) => (
          <div key={comment._id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {isLoading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar
                    alt={comment.userId?.fullName}
                    src={
                      comment.userId?.avatarUrl
                        ? comment.userId.avatarUrl
                        : '/noavatar.png'
                    }
                  />
                )}
              </ListItemAvatar>
              {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Skeleton variant="text" height={25} width={120} />
                  <Skeleton variant="text" height={18} width={230} />
                </div>
              ) : (
                <ListItemText
                primary={comment.fullName}
                secondary={comment.text}
                className={styles.text}
              />
              )}
              {comment?.userId._id === userData?._id && (
                <div className={styles.btnContainer}>
                  <IconButton color="secondary">
                    <DeleteIcon sx={{ color: 'red', opacity: 0.7 }} />
                  </IconButton>
                </div>
              )}
            </ListItem>
            <div className={styles.dataContainer}>
              <ListItemText secondary={formatDate(comment.createdAt)} />
            </div>
            {index < resultComments.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </div>
        ))}
      </List>

      {children}
    </SideBlock>
  );
};
