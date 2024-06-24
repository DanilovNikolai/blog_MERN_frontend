import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// components
import { Post } from '../components/Post';
import { AddComment } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';
// axios
import axios from '../axios';

export const FullPost = () => {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    axios
      .get(`/posts/${params.id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении статьи');
      });
  }, [params.id]);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost
      >
        <p>{data.text}</p>
      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: 'Вася Пупкин',
              avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
            },
            text: 'Это тестовый комментарий 555555',
          },
          {
            user: {
              fullName: 'Иван Иванов',
              avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
            },
            text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
          },
        ]}
        isLoading={false}
      >
        <AddComment />
      </CommentsBlock>
    </>
  );
};
