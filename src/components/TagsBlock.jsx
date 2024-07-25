import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
// mui
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import TagIcon from '@mui/icons-material/Tag';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
// components
import { SideBlock } from './SideBlock';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostsByTags } from '../redux/slices/postsSlice';

export const TagsBlock = ({ tags, isLoading = true }) => {
  const { tag } = useParams(); // Получаем параметр "tag" из URL
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPostsByTags());
  }, [tag]);

  return (
    <SideBlock title="Популярные тэги">
      <List>
        {(isLoading ? [...Array(5)] : tags).map((tag, index) => (
          <Link
            style={{ textDecoration: 'none', color: 'black' }}
            to={`/tags/${tag}`}
            key={index}
          >
            <ListItem key={index} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <TagIcon />
                </ListItemIcon>
                {isLoading ? (
                  <Skeleton width={100} />
                ) : (
                  <ListItemText primary={tag} />
                )}
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </SideBlock>
  );
};
