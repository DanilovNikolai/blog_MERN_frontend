import React from 'react';
// mui
import { SideBlock } from './SideBlock';
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
import { formatDate } from '../utils/formatDate';

export const CommentsBlock = ({
  comments = [],
  postId,
  children,
  isLoading = true,
}) => {
  // Получаем текущий URL
  const location = useLocation();
  let resultComments = [];
  let title;

  if (
    location.pathname === '/' ||
    (location.pathname.startsWith('/tags') && comments.length)
  ) {
    // На главной странице показываем последние 5 комментариев
    resultComments = comments.slice(0, 5);
    title = resultComments.length ? (
      'Последние комментарии'
    ) : (
      <>
        Комментарии
        <br />
        <span>Здесь пока пусто...</span>
      </>
    );
  } else if (
    location.pathname.startsWith(`/posts/${postId}`) &&
    comments.length
  ) {
    // На странице поста фильтруем комментарии по postId
    resultComments = comments;
    title = resultComments.length ? (
      'Комментарии'
    ) : (
      <>
        Комментарии
        <br />
        <span>Здесь пока пусто...</span>
      </>
    );
  }

  return (
    <SideBlock title={title}>
      <List>
        {(isLoading ? [...Array(5)] : resultComments)?.map((comment, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {isLoading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar
                    alt={comment.fullName}
                    src={`${process.env.REACT_APP_API_URL}${comment.avatarUrl}`}
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
