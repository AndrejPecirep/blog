import { useState, useEffect } from 'react';
import apiClient from '../apiClient';

export default function usePosts(page = 1) {
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiClient.get('/posts', { params: { page } })
      .then(res => {
        setPosts(res.data.posts);
        setMeta({
          total: res.data.total,
          page: res.data.page,
          totalPages: res.data.totalPages
        });
      })
      .finally(() => setLoading(false));
  }, [page]);

  return { posts, meta, loading };
}
