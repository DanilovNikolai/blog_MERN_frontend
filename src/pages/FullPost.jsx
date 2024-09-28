import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
// components
import { Post } from '../components/Post';
import { AddComment } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';
// axios
import axios from '../axios';
// redux
import { useSelector } from 'react-redux';
// ReactMarkdown
import ReactMarkdown from 'react-markdown';

export const FullPost = () => {
  const [postsData, setPostsData] = useState({});
  const [commentsData, setCommentsData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const params = useParams();
  const userData = useSelector((state) => state.auth.userData);

  // Используем useCallback для мемоизации функции запроса данных
  const fetchPostData = useCallback(async () => {
    try {
      const posts = await axios.get(`/posts/${params.id}`);
      const comments = await axios.get(`/posts/${params.id}/comments`);

      setPostsData(posts.data);
      setCommentsData(comments.data);
      setLoading(false);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при получении данных');
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    setLoading(true);
    fetchPostData();
  }, [fetchPostData]);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  // Функция для обновления комментариев
  const handleAddComment = (newComment) => {
    setCommentsData((prevComments) => [newComment, ...prevComments]);
  };

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
        commentsCount={commentsData.length}
        tags={postsData.tags}
        isFullPost
      >
        <ReactMarkdown children={postsData.text} />
      </Post>
      <CommentsBlock
        comments={commentsData}
        postId={params.id}
        isLoading={isLoading}
      >
        <AddComment user={userData} onAddComment={handleAddComment}/>
      </CommentsBlock>
    </>
  );
};
