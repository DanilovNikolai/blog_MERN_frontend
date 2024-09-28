import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
// components
import { Post } from '../components/Post';
import { AddComment } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';
// axios
import axios from '../axios';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { fetchComments } from '../redux/slices/commentsSlice';
// ReactMarkdown
import ReactMarkdown from 'react-markdown';

export const FullPost = () => {
  const dispatch = useDispatch();
  const [postsData, setPostsData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const params = useParams();
  const { comments } = useSelector((state) => state.comments);
  const userData = useSelector((state) => state.auth.userData);
  const filteredComments = comments.items?.filter(
    (comment) => comment.postId === params.id
  );

  // Используем useCallback для мемоизации функции запроса данных
  const fetchPostData = useCallback(async () => {
    try {
      const posts = await axios.get(`/posts/${params.id}`);
      setPostsData(posts.data);
      setLoading(false);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при получении данных');
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    dispatch(fetchComments());
  }, [dispatch]);

  useEffect(() => {
    setLoading(true);
    fetchPostData();
  }, [fetchPostData]);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      <Post
        id={postsData._id}
        title={postsData.title}
        imageUrl={
          postsData.imageUrl ? `http://localhost:4444${postsData.imageUrl}` : ''
        }
        user={postsData.user}
        createdAt={postsData.createdAt}
        viewsCount={postsData.viewsCount}
        commentsCount={filteredComments.length}
        tags={postsData.tags}
        isFullPost
      >
        <ReactMarkdown children={postsData.text} />
      </Post>
      <CommentsBlock
        comments={filteredComments} // Фильтруем комментарии по postId
        postId={params.id}
        isLoading={isLoading}
      >
        <AddComment user={userData} />
      </CommentsBlock>
    </>
  );
};
