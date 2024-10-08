import { useRef } from 'react';
// router
import { Link } from 'react-router-dom';
// scss
import styles from './Header.module.scss';
// redux-toolkit
import {
  logout,
  selectIsAuth,
  fetchUserUpdate,
  fetchAuthMe,
} from '../../redux/slices/authSlice';
import { useSelector, useDispatch } from 'react-redux';
// axios
import axios from '../../axios';

export const Header = () => {
  const isAuth = useSelector(selectIsAuth);
  const { userData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const inputFileRef = useRef(null);

  const onClickLogout = () => {
    if (window.confirm('Вы точно хотите выйти?')) {
      dispatch(logout());
      localStorage.removeItem('token');
    }
  };

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData(); // для загрузки изображений на бэк-енд
      const file = event.target.files[0];
      formData.append('image', file);

      // Отправляем изображение на сервер
      const { data } = await axios.post('/upload', formData);
      const imageUrl = data.url;

      // Обновляем информацию о пользователе на сервере
      await dispatch(
        fetchUserUpdate({ id: userData._id, params: { avatarUrl: imageUrl } })
      );
      dispatch(fetchAuthMe()); // обновляем данные пользователя после изменения аватара
    } catch (err) {
      console.warn(err);
      alert('Ошибка при загрузке файла');
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <Link to="/" className={styles.logo}>
            <div># BLOG FOR FRIENDS</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <div className={styles.userContainer}>
                  <div className={styles.avatarContainer}>
                    <img
                      onClick={() => inputFileRef.current.click()}
                      className={styles.avatar}
                      src={
                        userData.avatarUrl
                          ? `${process.env.REACT_APP_API_URL}${userData.avatarUrl}`
                          : '/noavatar.png'
                      }
                      alt={userData.fullName}
                    />
                    <input
                      ref={inputFileRef}
                      type="file"
                      onChange={handleChangeFile}
                      hidden
                    />
                  </div>
                  <div className={styles.userName}>{userData.fullName}</div>
                </div>
                <Link to="/posts/create" className={styles.link}>
                  <button className={`${styles.button} ${styles.writeButton}`}>
                    Написать статью
                  </button>
                </Link>
                <button
                  onClick={onClickLogout}
                  className={`${styles.button} ${styles.logoutButton}`}
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className={styles.link}>
                  <button className={styles.button}>Войти</button>
                </Link>
                <Link to="/auth/register" className={styles.link}>
                  <button
                    className={`${styles.button} ${styles.createAccountButton}`}
                  >
                    Создать аккаунт
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
