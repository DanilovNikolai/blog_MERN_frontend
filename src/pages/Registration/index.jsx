import React from 'react';
// router
import { Navigate } from 'react-router-dom';
// mui
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
// scss
import styles from './Login.module.scss';
// react-hook-form
import { useForm } from 'react-hook-form';
// redux-toolkit
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegister, selectIsAuth } from '../../redux/slices/authSlice';

export const Registration = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  // hook useForm
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  // выполняется только тогда, когда валидация прошла успешно
  // передаем данные пользователя на бэкенд
  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values));

    if (!data.payload) {
      return alert('Не удалось зарегестрироваться');
    }

    if ('token' in data.payload) {
      localStorage.setItem('token', data.payload.token);
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          error={!!errors.fullName?.message}
          helperText={errors.fullName?.message}
          {...register('fullName', { required: 'Укажите полное имя' })}
          className={styles.field}
          label="Полное имя"
          fullWidth
        />
        <TextField
          type="email"
          error={!!errors.email?.message}
          helperText={errors.email?.message}
          {...register('email', { required: 'Укажите почту' })}
          className={styles.field}
          label="E-mail"
          fullWidth
        />
        <TextField
          type="password"
          error={!!errors.password?.message}
          helperText={errors.password?.message}
          {...register('password', { required: 'Введите пароль' })}
          className={styles.field}
          label="Пароль"
          fullWidth
        />
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
