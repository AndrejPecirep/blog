import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      <div className="post-card-media">
        {post.imageUrl ? (
          <img src={`${import.meta.env.VITE_UPLOADS_BASE_URL || 'http://localhost:5000'}${post.imageUrl}`} alt={post.title} />
        ) : (
          <div className="post-card-placeholder">Blog</div>
        )}
      </div>
      <div className="post-card-content">
        <div className="meta-row">
          <span>{post.author?.username || 'Unknown author'}</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>
        <Link to={`/post/${post.slug}`} className="post-card-title">{post.title}</Link>
        <p>{post.content?.slice(0, 140)}...</p>
        <div className="tag-row">
          {post.Tags?.slice(0, 3).map((tag) => <span key={tag.id || tag.name} className="tag-pill">#{tag.name}</span>)}
        </div>
        <div className="meta-row bottom-row">
          <span>{post.readingTime || 1} min read</span>
          <span>{post.commentsCount || 0} comments</span>
        </div>
      </div>
    </article>
  );
}
