import React, { useState, useEffect } from 'react';
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
  const [commentsData, setCommentsData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const params = useParams();
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    axios
      .get(`/posts/${params.id}`)
      .then((res) => {
        setPostsData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении статьи');
      });

    axios
      .get(`/posts/${params.id}/comments`)
      .then((res) => {
        setCommentsData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении комментариев');
      });
  }, [params.id]);

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
        commentsCount={3}
        tags={postsData.tags}
        isFullPost
      >
        <ReactMarkdown children={postsData.text} />
      </Post>
      <CommentsBlock
        comments={commentsData}
        postId={params.id}
        isLoading={false}
      >
        <AddComment user={userData} />
      </CommentsBlock>
    </>
  );
};
