import React from 'react';
// styles
import styles from './SideBlock.module.scss';
// mui
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export const SideBlock = ({ title, children, onShowComments, onShowTags }) => {
  const handleShowItems = () => {
    // Проверка наличия обработчиков перед вызовом
    if (onShowComments) onShowComments();
    if (onShowTags) onShowTags();
  };

  return (
    <Paper className={styles.root}>
      <Typography
        variant="h6"
        className={styles.title}
        onClick={handleShowItems}
      >
        {title}
      </Typography>
      {children}
    </Paper>
  );
};
