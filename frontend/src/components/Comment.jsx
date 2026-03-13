import React from 'react';
import { formatDate } from '../utils/formatDate';

export default function Comment({ comment, onDelete }) {
  return (
    <div className="comment-box fade-in">
      <div className="flex justify-between items-center mb-1">
        <span className="comment-author">{comment.author.username}</span>
        <span className="comment-date">{formatDate(comment.createdAt)}</span>
      </div>
      <p>{comment.content}</p>
      {onDelete && (
        <button onClick={() => onDelete(comment.id)} className="comment-delete">Delete</button>
      )}
    </div>
  );
}