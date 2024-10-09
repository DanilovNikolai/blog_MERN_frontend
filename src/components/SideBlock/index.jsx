import React from 'react';
import styles from './SideBlock.module.scss';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export const SideBlock = ({ title, children, onShowComments, onShowTags }) => {
  const handleShowItems = () => {
    // Проверка наличия обработчиков перед вызовом
    if (onShowComments) onShowComments();
    if (onShowTags) onShowTags();
  };

  return (
    <Paper classes={{ root: styles.root }} >
      <Typography variant="h6" classes={{ root: styles.title }} onClick={handleShowItems}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
};
