import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// router
import { useNavigate, Navigate, useParams } from 'react-router-dom';
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
// axios
import axios from '../../axios';

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [errorTags, setErrorTags] = useState(null);
  const [errorText, setErrorText] = useState(null);
  const [errorTitle, setErrorTitle] = useState(null);
  const inputFileRef = useRef(null);

  const isEditing = !!id;

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData(); // для загрузки изображений на бэк-енд
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при загрузке файла');
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl(null);
  };

  // Функция для проверки тегов на наличие недопустимых символов и пробелов после запятых
  const validateTags = (tags) => {
    return tags
      .split(',')
      .every((tag) => /^[a-zA-Z0-9]+$/.test(tag.trim()) && tag === tag.trim());
  };

  const onSubmit = async () => {
    // Проверка тегов на допустимость
    if (!validateTags(tags)) {
      setErrorTags(
        'Тэги могут содержать только латинские буквы и цифры без пробелов и специальных символов. Тэги разделяются между собой запятыми без пробелов.'
      );
      return;
    }
    if (errorText?.length < 10) {
      setErrorText('Текст должен содержать не менее 10 символов!');
      return;
    }
    if (errorTitle?.length < 3) {
      setErrorTitle('Заголовк должен содержать не менее 3 символов!');
      return;
    }

    try {
      setLoading(true);
      setErrorTags(null);

      const fields = {
        title,
        text,
        tags,
        imageUrl,
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при создании статьи');
    }
  };

  // управляемый текст в редакторе текста, обязательно с исп. useCallback
  const onChange = useCallback((value) => {
    setText(value);
  }, []);

  // настройки редактора текста, обязательно с исп. useMemo
  const options = useMemo(
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

  // Проверяем, есть ли id поста в url, сохраняем все данные поста в стейты, когда находимся в редакторе поста
  useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setText(data.text);
          setImageUrl(data.imageUrl);
          setTags(data.tags.join(','));
        })
        .catch((err) => {
          console.warn(err);
          alert('Ошибка при получении статьи');
        });
    }
  }, [id]);

  if (!localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
      >
        Загрузить превью
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Удалить
          </Button>
          <img
            className={styles.image}
            src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
            alt="Uploaded"
          />
        </>
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
      {errorTitle && (
        <div style={{ color: 'red', marginTop: '10px' }}>{errorTitle}</div>
      )}
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Введите тэги через запятые без пробелов"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      {errorTags && (
        <div style={{ color: 'red', marginTop: '10px' }}>{errorTags}</div>
      )}
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      {errorText && (
        <div style={{ color: 'red', marginTop: '10px' }}>{errorText}</div>
      )}
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
