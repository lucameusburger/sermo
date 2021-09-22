import React, { useState, useRef, useEffect } from 'react';
import ArticlesList from './ArticlesList';
import UsersList from './UsersList';
import CommentsList from './CommentsList';

export default function SearchResults({ articles = [], users = [], comments = [], active = false, mode = 'md' }) {
  function articlesResult() {
    if (!active) return;
    if (!articles.length) return <p className="text-muted">no articles found</p>;
    return <ArticlesList articles={articles} mode="sm" />;
  }
  function usersResult() {
    if (!active) return;
    if (!users.length) return <p className="text-muted">no users found</p>;
    return <UsersList users={users} mode="sm" />;
  }
  function commentsResult() {
    if (!active) return;
    if (!comments.length) return <p className="text-muted">no comments found</p>;
    return <CommentsList comments={comments} mode="sm" />;
  }
  return (
    <div>
      {articlesResult()}
      {usersResult()}
      {commentsResult()}
    </div>
  );
}
