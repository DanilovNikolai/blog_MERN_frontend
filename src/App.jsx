import { useEffect, useState } from 'react';
// mui
import Container from '@mui/material/Container';
// routes
import { Routes, Route } from 'react-router-dom';
// components
import { Header } from './components';
// pages
import {
  Home,
  FullPost,
  Registration,
  AddPost,
  Login,
  PostsByTags,
} from './pages';
// redux-toolkit
import { useDispatch } from 'react-redux';
import { fetchAuthMe } from './redux/slices/authSlice';
// axios
import axios from './axios';

function App() {
  const dispatch = useDispatch();
  const [isServerOnline, setIsServerOnline] = useState(false);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        await axios.get(`${process.env.REACT_APP_API_URL}/posts`);
        setIsServerOnline(true);
      } catch (error) {
        console.error('Сервер недоступен:', error);
        setIsServerOnline(false);
      }
    };

    checkServerStatus();
  }, []);

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, [dispatch]);

  if (!isServerOnline) {
    return (
      <Container maxWidth="lg">
        <div>
          <h1 style={{ margin: '150px 30px' }}>
            Без паники! <br />
            Сервер временно отключен, чтобы не платить за него, пока он не нужен
            :) <br />
            Если понадобится, я в любой момент его включу!
          </h1>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/posts/create" element={<AddPost />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Registration />} />
          <Route path="/tags/:tag" element={<PostsByTags />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
