import React from 'react';
import Comment from './Comment';

export default function CommentsList({ comments = [], mode = 'md' }) {
  console.log(comments);
  return comments.map((comment) => {
    return <Comment key={comment._id} comment={comment} mode={mode} />;
  });
}
