import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// components
import { Post } from '../../components/Post';
import { AddComment } from '../../components/AddComment';
import { CommentsBlock } from '../../components/CommentsBlock';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { fetchComments } from '../../redux/slices/commentsSlice';
import { fetchPostById } from '../../redux/slices/postsSlice';
// ReactMarkdown
import ReactMarkdown from 'react-markdown';
// utils
import { formatDate } from '../../utils/formatDate';

export const FullPost = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { comments } = useSelector((state) => state.comments);
  const { posts } = useSelector((state) => state.posts);
  const userData = useSelector((state) => state.auth.userData);

  // находим пост по и комментарии к нему по id
  const post = posts.items.find((post) => post._id === params.id);
  const filteredComments = comments.items?.filter(
    (comment) => comment.postId === params.id
  );

  useEffect(() => {
    dispatch(fetchPostById(params.id));
    dispatch(fetchComments());
  }, [dispatch, params.id]);

  if (!post) {
    return <Post isLoading={true} isFullPost />;
  }

  return (
    <>
      <Post
        id={post._id}
        title={post.title}
        imageUrl={posts.items ? post.imageUrl : '/noimage.png'}
        user={post.user}
        createdAt={formatDate(post.createdAt)}
        viewsCount={post.viewsCount} // Количество просмотров
        commentsCount={filteredComments.length} // Количество комментариев
        likesCount={post.likesCount}
        tags={post.tags}
        isFullPost
      >
        <ReactMarkdown children={post.text} />
      </Post>
      {(filteredComments.length || userData) && (
        <CommentsBlock
          comments={filteredComments} // Фильтруем комментарии по postId
          postId={params.id}
          isLoading={comments.status === 'loading'}
        >
          {userData && <AddComment user={userData} />}
        </CommentsBlock>
      )}
    </>
  );
};
