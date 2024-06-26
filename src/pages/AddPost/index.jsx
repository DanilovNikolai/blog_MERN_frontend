import React from 'react';
// router
import { Navigate } from 'react-router-dom';
// mui
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
// mde
import SimpleMDE from 'react-simplemde-editor';
// styles
import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
// redux-toolkit
import { selectIsAuth } from '../../redux/slices/authSlice';
import { useSelector } from 'react-redux';

export const AddPost = () => {
  const imageUrl = '';
  const isAuth = useSelector(selectIsAuth);
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');

  const handleChangeFile = () => {};

  const onClickRemoveImage = () => {};

  // управляемый текст в редакторе текста, обязательно с исп. useCallback
  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  // настройки редактора текста, обязательно с исп. useMemo
  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (!localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  console.log({ title, text, tags });

  return (
    <Paper style={{ padding: 30 }}>
      <Button variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Удалить
        </Button>
      )}
      {imageUrl && (
        <img
          className={styles.image}
          src={`http://localhost:4444${imageUrl}`}
          alt="Uploaded"
        />
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button size="large" variant="contained">
          Опубликовать
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
