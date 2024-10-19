import React, { useState, useEffect } from 'react';
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
import { SideBlock } from '../SideBlock';
// redux
import { useDispatch } from 'react-redux';
import { fetchPostsByTags } from '../../redux/slices/postsSlice';
// styles
import styles from './TagsBlock.module.scss';

export const TagsBlock = ({ tags, isLoading = true, isMobile }) => {
  const { tag } = useParams(); // Получаем параметр "tag" из URL
  const [tagsVisible, setTagsVisible] = useState(!isMobile);
  const dispatch = useDispatch();

  // Сбрасываем видимость тэгов при смене режима (mobile/desktop)
  useEffect(() => {
    setTagsVisible(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (tag) {
      dispatch(fetchPostsByTags());
    }
  }, [dispatch, tag]);

  const handleShowTags = () => {
    if (isMobile) {
      setTagsVisible(!tagsVisible);
    }
  };

  return (
    <SideBlock
      title={
        <div className={styles.title} onClick={handleShowTags}>
          <span>Популярные тэги</span>{' '}
          {isMobile && (
            <span className={styles.arrow}>{tagsVisible ? '▲' : '▼'}</span>
          )}
        </div>
      }
      className={styles.container}
    >
      <List
        className={`${styles.list} ${tagsVisible ? styles.show : styles.hide}`}
      >
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
