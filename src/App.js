import { useEffect } from 'react';
// mui
import Container from '@mui/material/Container';
// routes
import { Routes, Route } from 'react-router-dom';
// components
import { Header } from './components';
// pages
import { Home, FullPost, Registration, AddPost, Login } from './pages';
// redux-toolkit
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuth, fetchAuthMe } from './redux/slices/authSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/posts/create" element={<AddPost />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Registration />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
