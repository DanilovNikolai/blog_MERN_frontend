import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
// components
import { Post } from '../../components/Post';
import { AddComment } from '../../components/AddComment';
import { CommentsBlock } from '../../components/CommentsBlock';
// axios
import axios from '../../axios';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { fetchComments } from '../../redux/slices/commentsSlice';
import { fetchPosts } from '../../redux/slices/postsSlice';
// ReactMarkdown
import ReactMarkdown from 'react-markdown';
// utils
import { formatDate } from '../../utils/formatDate';

export const FullPost = () => {
  const dispatch = useDispatch();
  const [postsData, setPostsData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const params = useParams();
  const { comments } = useSelector((state) => state.comments);
  const { posts } = useSelector((state) => state.posts);
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
    dispatch(fetchPosts());
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
        imageUrl={posts.items ? postsData.imageUrl : '/noimage.png'}
        user={postsData.user}
        createdAt={formatDate(postsData.createdAt)}
        viewsCount={postsData.viewsCount} // Количество просмотров
        commentsCount={filteredComments.length} // Количество комментариев
        likesCount={postsData.likesCount}
        tags={postsData.tags}
        isFullPost
      >
        <ReactMarkdown children={postsData.text} />
      </Post>
      {(filteredComments.length || userData) && (
        <CommentsBlock
          comments={filteredComments} // Фильтруем комментарии по postId
          postId={params.id}
          isLoading={isLoading}
        >
          {userData && <AddComment user={userData} />}
        </CommentsBlock>
      )}
    </>
  );
};
