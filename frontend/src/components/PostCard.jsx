import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      <Link to={`/post/${post.slug}`}>
        <h2>{post.title}</h2>
      </Link>
      <p>{post.content?.slice(0, 100)}...</p>
      <p>By {post.author?.username || "Unknown"}</p>
    </div>
  );
};

export default PostCard;
