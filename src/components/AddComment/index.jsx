import { useState } from 'react';
import { useParams } from 'react-router-dom';
// styles
import styles from './AddComment.module.scss';
// mui
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
// axios
import axios from '../../axios';
// redux
import { useDispatch } from 'react-redux';
import { addComment } from '../../redux/slices/commentsSlice.js';

export const AddComment = ({ user }) => {
  const [inputText, setInputText] = useState('');
  const params = useParams();
  const dispatch = useDispatch();

  const handleButtonPost = async () => {
    try {
      const response = await axios.post('/comments', {
        fullName: user.fullName,
        userId: user._id,
        postId: params.id,
        text: inputText,
        avatarUrl: user.avatarUrl || '/noavatar.png',
      });

      // Добавляем комментарий в Redux
      dispatch(addComment(response.data));
      setInputText('');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={
            user?.avatarUrl
              ? `${process.env.REACT_APP_API_URL}${user.avatarUrl}`
              : '/noavatar.png'
          }
        />
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
          <Button onClick={handleButtonPost} variant="contained">
            Отправить
          </Button>
        </div>
      </div>
    </>
  );
};
