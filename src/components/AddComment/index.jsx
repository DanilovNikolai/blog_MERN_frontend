import { useState } from 'react';
import { useParams } from 'react-router-dom';
// styles
import styles from './AddComment.module.scss';
// mui
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
// redux
import { useDispatch } from 'react-redux';
import {
  fetchAddComment,
  fetchComments,
} from '../../redux/slices/commentsSlice';

export const AddComment = ({ user }) => {
  const [inputText, setInputText] = useState('');
  const params = useParams();
  const dispatch = useDispatch();

  const handleAddComment = async () => {
    const newComment = {
      fullName: user.fullName,
      userId: user._id,
      postId: params.id,
      text: inputText,
      avatarUrl: user.avatarUrl ? user.avatarUrl : '/noavatar.png',
    };

    try {
      // Добавляем комментарий в Redux
      await dispatch(fetchAddComment(newComment));
      dispatch(fetchComments());
      setInputText('');
    } catch (err) {
      console.error('Ошибка при добавлении комментария:', err);
    }
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar classes={{ root: styles.avatar }} src={user?.avatarUrl} />
        <div className={styles.form}>
          <TextField
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
          />
          <Button onClick={handleAddComment} variant="contained">
            Отправить
          </Button>
        </div>
      </div>
    </>
  );
};
