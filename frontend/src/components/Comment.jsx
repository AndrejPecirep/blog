import React from 'react';
import { formatDate } from '../utils/formatDate';

export default function Comment({ comment, canDelete, onDelete }) {
  return (
    <div className="comment-box">
      <div className="meta-row">
        <strong>{comment.author?.username || 'User'}</strong>
        <span>{formatDate(comment.createdAt)}</span>
      </div>
      <p>{comment.content}</p>
      {canDelete && (
        <button className="text-button" onClick={() => onDelete(comment.id)}>
          Delete comment
        </button>
      )}
    </div>
  );
}
