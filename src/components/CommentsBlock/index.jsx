import React, { useState, useEffect } from 'react';
// mui
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

export const CommentsBlock = ({
  comments = [],
  postId,
  children,
  isLoading = true,
  isMobile,
}) => {
  const location = useLocation();
  const [commentsVisible, setCommentsVisible] = useState(!isMobile);

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
    console.log(commentsVisible);
    if (isMobile) {
      setCommentsVisible(!commentsVisible);
    }
  };

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
          <React.Fragment key={comment._id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {isLoading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar
                    alt={comment.userId?.fullName}
                    src={
                      comment.userId?.avatarUrl
                        ? `${process.env.REACT_APP_API_URL}${comment.userId.avatarUrl}`
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
                />
              )}
            </ListItem>
            <div
              style={{
                textAlign: 'right',
                marginRight: '15px',
                marginBottom: '5px',
              }}
            >
              <ListItemText secondary={formatDate(comment.createdAt)} />
            </div>
            {index < resultComments.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>

      {children}
    </SideBlock>
  );
};
