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

export const AddComment = ({ user }) => {
  const [inputText, setInputText] = useState('');
  const params = useParams();

  const handleButtonPost = async () => {
    try {
      axios.post('/comments', {
        fullName: user.fullName,
        userId: user._id,
        postId: params.id,
        text: inputText,
        avatarUrl: user.avatarUrl,
      });
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
            user.avatarUrl
              ? `http://localhost:4444${user.avatarUrl}`
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
