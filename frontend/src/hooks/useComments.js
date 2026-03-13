import { useState, useEffect } from 'react';
import apiClient from '../apiClient';

export default function useComments(postId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    setLoading(true);
    apiClient.get(`/comments/post/${postId}`)
      .then(res => setComments(res.data.comments))
      .finally(() => setLoading(false));
  }, [postId]);

  const addComment = async (content) => {
    const res = await apiClient.post('/comments', { postId, content });
    setComments(prev => [...prev, res.data.comment]);
  };

  const deleteComment = async (id) => {
    await apiClient.delete(`/comments/${id}`);
    setComments(prev => prev.filter(c => c.id !== id));
  };

  return { comments, loading, addComment, deleteComment };
}
