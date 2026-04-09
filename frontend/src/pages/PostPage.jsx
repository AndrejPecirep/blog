import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import apiClient from '../apiClient';
import Loader from '../components/Loader';
import Comment from '../components/Comment';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatDate';

const uploadsBase = import.meta.env.VITE_UPLOADS_BASE_URL || 'https://blog-2-gpkq.onrender.com';

export default function PostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const canManagePost = useMemo(() => user && post && (user.id === post.userId || user.role === 'admin'), [user, post]);

  const loadPost = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get(`/posts/${slug}`);
      setPost(data);
      const commentsResponse = await apiClient.get(`/comments/post/${data.id}`);
      setComments(commentsResponse.data.comments || []);
    } catch (error) {
      console.error(error);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
  }, [slug]);

  const submitComment = async (event) => {
    event.preventDefault();
    if (!commentText.trim()) return;

    try {
      setSubmitting(true);
      const { data } = await apiClient.post('/comments', {
        postId: post.id,
        content: commentText.trim()
      });
      setComments((current) => [...current, data.comment]);
      setCommentText('');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await apiClient.delete(`/comments/${commentId}`);
      setComments((current) => current.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error(error);
    }
  };

  const deletePost = async () => {
    try {
      await apiClient.delete(`/posts/${post.id}`);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <Loader />;
  if (!post) return <section className="empty-state">Post not found.</section>;

  return (
    <div className="page-stack">
      <article className="article-shell">
        <div className="article-header">
          <span className="eyebrow">{formatDate(post.createdAt)}</span>
          <h1>{post.title}</h1>
          <div className="article-meta">
            <span>Author: {post.author?.username || 'Unknown author'}</span>
            <span>{post.readingTime || 1} min read</span>
            <span>{comments.length} comments</span>
          </div>
          <div className="tag-row">
            {post.Tags?.map((tag) => <span className="tag-pill" key={tag.id || tag.name}>#{tag.name}</span>)}
          </div>
          {canManagePost && (
            <div className="inline-actions">
              <Link className="button button-secondary" to={`/create?edit=${post.id}`}>Edit</Link>
              <button className="button button-ghost" onClick={deletePost}>Delete</button>
            </div>
          )}
        </div>

        {post.imageUrl && <img className="article-cover" src={`${uploadsBase}${post.imageUrl}`} alt={post.title} />}

        <div className="article-content">
          {post.content.split('\n').filter(Boolean).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>

      <section className="comments-shell">
        <div className="section-heading">
          <h2>Comments</h2>
          <span>{comments.length} total</span>
        </div>

        {isAuthenticated ? (
          <form className="toolbar-card comment-form" onSubmit={submitComment}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a thoughtful comment..."
            />
            <button className="button button-primary" disabled={submitting} type="submit">
              {submitting ? 'Submitting...' : 'Post comment'}
            </button>
          </form>
        ) : (
          <div className="toolbar-card">You need to sign in to comment.</div>
        )}

        <div className="comments-list">
          {comments.length === 0 ? (
            <div className="empty-state small">No comments yet. Be the first.</div>
          ) : (
            comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                canDelete={user && (user.id === comment.userId || user.role === 'admin')}
                onDelete={deleteComment}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
